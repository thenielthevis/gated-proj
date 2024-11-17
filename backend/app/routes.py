import os
import socket
from typing import List, Any, Dict
from fastapi import UploadFile, File, APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from cryptography.fernet import Fernet
from .models import User, UserInDB, MongoDBRequest, FileUploadRecord, FirestoreScanRequest, FirebaseHostingScanRequest, ScanResult, Finding, AnalyticsData
from .services import create_user, get_user_by_username, scan_mongo_db_for_risks, validate_sql_script, validate_json_script, store_file_upload_record, scan_firestore_for_risks, scan_firebase_hosting, is_valid_firebase_domain
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import Depends, HTTPException
from datetime import datetime, timedelta
from .auth import get_current_user, create_access_token

env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

MONGO_URI = os.getenv("DB_URI")
DATABASE_NAME = "gated"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

mongo_client = AsyncIOMotorClient(MONGO_URI)
db = mongo_client[DATABASE_NAME]
reports_collection = db["reports"]
users_collection = db["users"]

# Load environment variables
secret_key = os.getenv("SECRET_KEY")
if not secret_key:
    raise ValueError("SECRET_KEY not found in environment variables")

cipher_suite = Fernet(secret_key.encode())

# USER login and register
class LoginData(BaseModel):
    username: str
    password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Define Routers
user_router = APIRouter()
mongo_scan_router = APIRouter()
sql_scan_router = APIRouter()
json_scan_router = APIRouter()
firebase_scan_router = APIRouter()
analytics_router = APIRouter()

# Register route
@user_router.post("/register")
async def register(user: User):
    hashed_password = pwd_context.hash(user.password)
    user_in_db = UserInDB(username=user.username, password=hashed_password, role=user.role)

    if get_user_by_username(user.username):
        raise HTTPException(status_code=400, detail="Username already registered.")
    
    user_id = create_user(user_in_db)
    return {"message": "User created successfully", "user_id": user_id}

# Login route with token generation
@user_router.post("/login")
async def login(login_data: LoginData):
    user_data = get_user_by_username(login_data.username)
    
    if user_data is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not pwd_context.verify(login_data.password, user_data['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "id": str(user_data['_id']),  # Ensure '_id' is included in the token payload
            "username": user_data['username'],
            "role": user_data['role']
        },
        expires_delta=access_token_expires
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "role": user_data['role'],
    }

# Fetch currently logged-in user details
@user_router.get("/current-user", response_model=Dict[str, Any])
async def get_current_user_details(current_user: Dict[str, Any] = Depends(get_current_user)):
    try:
        return {
            "user_id": current_user["id"],  # Change from "_id" to "id"
            "username": current_user["username"],
            "role": current_user["role"],
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Unauthorized: {str(e)}")


# Route for encrypting the MongoDB URI
@mongo_scan_router.post("/encrypt-uri/")
async def encrypt_mongodb_uri(data: MongoDBRequest):
    try:
        encrypted_uri = cipher_suite.encrypt(data.mongodb_uri.encode())
        return {"encrypted_uri": encrypted_uri.decode()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error encrypting URI: {e}")

# Route for decrypting the MongoDB URI
@mongo_scan_router.post("/decrypt-uri/")
async def decrypt_mongodb_uri(data: MongoDBRequest):
    try:
        decrypted_uri = cipher_suite.decrypt(data.mongodb_uri.encode()).decode()
        return {"decrypted_uri": decrypted_uri}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error decrypting URI: {e}")
    
async def store_file_upload_record(user_id: str, service: str, findings: dict):
    scan_record = {
        "user_id": user_id,
        "service": service,
        "findings": findings,
        "timestamp": datetime.now()
    }
    await reports_collection.insert_one(scan_record)

# Helper function to categorize scan results
def categorize_results(analysis: dict) -> dict:
    return {
        "danger": [{"check": "Dangerous Check", "result": message, "category": "Danger"} for message in analysis.get("errors", [])],
        "warning": [{"check": "Warning Check", "result": message, "category": "Warning"} for message in analysis.get("warnings", [])],
        "good": [{"check": "Good Practice", "result": message, "category": "Good"} for message in analysis.get("good_practices", [])],
    }

@mongo_scan_router.post("/mongodb")
async def scan_mongo_db(
    request: MongoDBRequest, 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        # Extract MongoDB URI and user information
        mongo_uri = request.mongodb_uri
        user_id = current_user["id"]

        if not mongo_uri:
            raise ValueError("MongoDB URI is required")

        # Perform the scan
        scan_result = scan_mongo_db_for_risks(mongo_uri)

        # Prepare data for saving
        categorized_results = {
            "danger": [r for r in scan_result["audit_results"] if r["category"] == "Danger"],
            "warning": [r for r in scan_result["audit_results"] if r["category"] == "Warning"],
            "good": [r for r in scan_result["audit_results"] if r["category"] == "Good"],
        }

        # Create the scan result with service name 'MONGODB'
        record = ScanResult(
            user_uri_id=str(user_id),
            service="MongoDB",
            findings=categorized_results,
            timestamp=datetime.now(),
        )

        # Insert the record into the 'reports' collection
        result = await db.reports.insert_one(record.dict())

        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Failed to save scan results")

        return {
            "status": "Scanning completed",
            "findings": categorized_results,
            "message": "Scan results saved successfully"
        }

    except Exception as e:
        print(f"Error during scan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during scanning: {str(e)}")
    
# SQL scan endpoint
@sql_scan_router.post("/upload-sql-file")
async def upload_sql_file(
    file: UploadFile = File(...), 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    if file.content_type != "text/plain":
        raise HTTPException(status_code=400, detail="Only text files are allowed.")
    
    content = await file.read()
    sql_content = content.decode("utf-8")
    
    # Validate SQL content
    try:
        analysis = validate_sql_script(sql_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error validating SQL script: {e}")

    # Categorize the results
    categorized_results = categorize_results(analysis)

    # Prepare the ScanResult for saving
    scan_result = ScanResult(
        user_uri_id=current_user["id"],
        service="SQL",
        findings=categorized_results,
        timestamp=datetime.now()
    )

    # Save the ScanResult in MongoDB
    try:
        await reports_collection.insert_one(scan_result.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file upload record: {e}")

    return {"analysis": categorized_results}

# JSON scan endpoint

@json_scan_router.post("/upload-json-file")
async def upload_json_file(
    file: UploadFile = File(...), 
    current_user: dict = Depends(get_current_user)
):
    if file.content_type != "application/json":
        raise HTTPException(status_code=400, detail="Only JSON files are allowed.")

    content = await file.read()
    try:
        json_content = content.decode("utf-8")
        analysis = validate_json_script(json_content)
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File is not valid JSON format")

    # Categorize the results
    categorized_results = categorize_results(analysis)

    # Save the upload record in MongoDB with the user ID from the token
    await store_file_upload_record(
        user_uri_id=current_user["id"], 
        service="JSON", 
        findings=categorized_results  # Now it’s a JSON-serializable dict
    )

    return {"analysis": categorized_results}

# Firestore scan endpoint
@firebase_scan_router.post("/firestore-scan")
async def firestore_scan(request: FirestoreScanRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Endpoint to scan Firestore databases for security risks.
    """
    try:
        firestore_key = request.firestore_key  # Extract Firestore key from request
        user_id = current_user["id"]

        if not firestore_key:
            raise ValueError("Firestore service account key is required")

        # Run the Firestore risk scan (Assume scan_firestore_for_risks is a function to perform the scan)
        audit_results = scan_firestore_for_risks(firestore_key)

        # Check if the audit_results is a dictionary (we expect it to be a dict with an 'audit_results' key)
        if isinstance(audit_results, dict):
            if 'audit_results' in audit_results:
                audit_results = audit_results['audit_results']
            else:
                raise ValueError("The returned dictionary does not contain 'audit_results' key")
        elif not isinstance(audit_results, list):
            raise ValueError(f"Expected a list of audit results, but got {type(audit_results)}")

        # Categorize the results
        categorized_results = categorize_results(audit_results)

        # Save the audit results in MongoDB
        await store_file_upload_record(user_id=user_id, service="Firestore", findings=categorized_results)

        return {"status": "Scanning completed", "findings": categorized_results, "message": "Scan results saved successfully"}

    except Exception as e:
        print(f"Error during Firestore scan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during Firestore scanning: {str(e)}")


@firebase_scan_router.post("/hosting-scan")
async def firebase_hosting_scan(request: FirebaseHostingScanRequest, current_user: Dict[str, Any] = Depends(get_current_user)) -> Any:
    """
    Endpoint to scan Firebase Hosting sites for security, performance, and configuration issues.
    """
    try:
        domain = request.domain.strip().lower()  # Extract and normalize the domain
        user_id = current_user["id"]

        if not domain:
            raise ValueError("Firebase Hosting domain URL is required")

        # Optionally, perform DNS lookup (can be skipped if Firebase domain check is enough)
        try:
            socket.gethostbyname(domain)  # Check if the domain resolves
        except socket.gaierror:
            raise ValueError(f"The domain '{domain}' does not resolve to any IP address.")

        # Run the Firebase Hosting scan (Assume scan_firebase_hosting is a function to perform the scan)
        audit_results = scan_firebase_hosting(domain)
        
        # Check if the audit_results is a dictionary (we expect it to be a dict with an 'audit_results' key)
        if isinstance(audit_results, dict):
            if 'audit_results' in audit_results:
                audit_results = audit_results['audit_results']
            else:
                raise ValueError("The returned dictionary does not contain 'audit_results' key")
        elif not isinstance(audit_results, list):
            raise ValueError(f"Expected a list of audit results, but got {type(audit_results)}")

        # Ensure each item in the audit_results is a dictionary with 'category' key
        for result in audit_results:
            if not isinstance(result, dict) or 'category' not in result:
                raise ValueError("Each audit result must be a dictionary with a 'category' key")

        # Categorize the results
        categorized_results = categorize_results(audit_results)

        # Save the scan results in MongoDB
        await store_file_upload_record(user_id=user_id, service="Firebase Hosting", findings=categorized_results)

        return {"status": "Scanning completed", "findings": categorized_results, "message": "Scan results saved successfully"}

    except Exception as e:
        print(f"Error during Firebase Hosting scan: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")
    

#ANALYTICS    
@analytics_router.get("/analytics", response_model=List[AnalyticsData])
async def get_analytics():
    try:
        pipeline = [
            {
                "$match": {
                    "findings": {"$exists": True, "$ne": {}}  # Ensure 'findings' exists and is not empty
                }
            },
            {
                "$project": {
                    "service": 1,
                    "timestamp": 1,
                    "findings_count": {
                        "$sum": [
                            {"$size": "$findings.good"},  # Count the number of 'good' findings
                            {"$size": "$findings.warning"},  # Count the number of 'warning' findings
                            {"$size": "$findings.danger"}  # Count the number of 'danger' findings
                        ]
                    },
                    "good": {
                        "$size": "$findings.good"  # Count the number of items in the 'good' array
                    },
                    "warning": {
                        "$size": "$findings.warning"  # Count the number of items in the 'warning' array
                    },
                    "danger": {
                        "$size": "$findings.danger"  # Count the number of items in the 'danger' array
                    }
                }
            },
            {
                "$group": {
                    "_id": "$service",  # Group by service name
                    "findings_count": {"$sum": "$findings_count"},  # Total findings count
                    "timestamp": {"$max": "$timestamp"},  # Get the latest timestamp
                    "good": {"$sum": "$good"},  # Total good findings count
                    "warning": {"$sum": "$warning"},  # Total warning findings count
                    "danger": {"$sum": "$danger"},  # Total danger findings count
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "service": "$_id",  # Project the service name
                    "findings_count": 1,
                    "timestamp": 1,
                    "good": 1,
                    "warning": 1,
                    "danger": 1
                }
            }
        ]
        
        # Log pipeline result for debugging
        print("Aggregation Pipeline:", pipeline)

        results = await reports_collection.aggregate(pipeline).to_list(None)

        if not results:
            raise HTTPException(status_code=404, detail="No analytics data found")
        
        # Ensure valid data is returned and log it
        for result in results:
            print("Processed Result:", result)

            if result.get('service') is None:
                result['service'] = 'Unknown'
                
            if result.get('timestamp') is None:
                result['timestamp'] = 'Unknown Timestamp'

            if 'findings' not in result:
                result['findings'] = []

        analytics_data = [AnalyticsData(**result) for result in results]
        
        return analytics_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analytics data: {str(e)}")
    
# USERS COUNT (New API for counting users)
@analytics_router.get("/users_count", response_model=int)
async def get_users_count():
    try:
        # Count the total number of users in the users collection
        users_count = await users_collection.count_documents({})
        
        # Return the users count
        return users_count
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users count: {str(e)}")
