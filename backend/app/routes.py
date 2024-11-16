import os
import re
import socket
from typing import List, Any
from fastapi import UploadFile, File, APIRouter, HTTPException, Request
from pydantic import BaseModel
from passlib.context import CryptContext
from cryptography.fernet import Fernet
from .models import User, UserInDB, MongoDBRequest, FirestoreScanRequest, FirebaseHostingScanRequest
from .services import create_user, get_user_by_username, scan_mongo_db_for_risks, validate_sql_script, scan_firestore_for_risks, scan_firebase_hosting, is_valid_firebase_domain
from fastapi.responses import JSONResponse

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
firebase_scan_router = APIRouter()

@user_router.post("/register")
async def register(user: User):
    hashed_password = pwd_context.hash(user.password)
    user_in_db = UserInDB(username=user.username, password=user.password, role=user.role)

    if get_user_by_username(user.username):
        raise HTTPException(status_code=400, detail="Username already registered.")
    
    user_id = create_user(user_in_db)
    return {"message": "User created successfully", "user_id": user_id}

# Login route
@user_router.post("/login")
async def login(login_data: LoginData):
    user_data = get_user_by_username(login_data.username)
    
    if user_data is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not pwd_context.verify(login_data.password, user_data['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful", "role": user_data['role']}

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

@mongo_scan_router.post("/mongodb")
async def scan_mongo_db(request: MongoDBRequest):
    try:
        mongo_uri = request.mongodb_uri  # FastAPI automatically parses the body

        if not mongo_uri:
            raise ValueError("MongoDB URI is required")

        # Run the MongoDB risk scan
        audit_results = scan_mongo_db_for_risks(mongo_uri)  # Custom function for scan

        # Log the audit results
        print("Audit results:", audit_results)

        # Return the scan results as a response
        return audit_results
    
    except Exception as e:
        # Log the error and send it in the response
        print(f"Error during scan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during scanning: {str(e)}")

# Endpoint to receive and validate the SQL file
@sql_scan_router.post("/upload-sql-file")
async def upload_sql_file(file: UploadFile = File(...)):
    if file.content_type != "text/plain":
        raise HTTPException(status_code=400, detail="Only text files are allowed.")

    content = await file.read()
    sql_content = content.decode("utf-8")
    
    # Validate each SQL statement in the content
    analysis = validate_sql_script(sql_content)

    return {"analysis": analysis}

@firebase_scan_router.post("/firestore-scan")
async def firestore_scan(request: FirestoreScanRequest):
    """
    Endpoint to scan Firestore databases for security risks.
    """
    try:
        firestore_key = request.firestore_key  # Extract Firestore key from request

        if not firestore_key:
            raise ValueError("Firestore service account key is required")

        # Run the Firestore risk scan
        audit_results = scan_firestore_for_risks(firestore_key)  # Custom function for scan

        # Log the audit results
        print("Audit results:", audit_results)

        # Return the scan results as a response
        return audit_results
    
    except Exception as e:
        # Log the error and send it in the response
        print(f"Error during Firestore scan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during Firestore scanning: {str(e)}")

@firebase_scan_router.post("/hosting-scan")
async def firebase_hosting_scan(request: FirebaseHostingScanRequest) -> Any:
    """
    Endpoint to scan Firebase Hosting sites for security, performance, and configuration issues.
    """
    try:
        domain = request.domain.strip().lower()  # Extract and normalize the domain
        
        if not domain:
            raise ValueError("Firebase Hosting domain URL is required")

        # Validate if the domain is a legitimate Firebase Hosting domain
        if not is_valid_firebase_domain(domain):
            raise ValueError(f"The domain '{domain}' is not a valid Firebase Hosting domain.")

        # Optionally, perform DNS lookup (can be skipped if Firebase domain check is enough)
        try:
            socket.gethostbyname(domain)  # Check if the domain resolves
        except socket.gaierror:
            raise ValueError(f"The domain '{domain}' does not resolve to any IP address.")

        # Run the Firebase Hosting scan
        audit_results = scan_firebase_hosting(domain)

        # Log the audit results
        print("Hosting scan results:", audit_results)

        # Return the scan results
        return audit_results
    
    except Exception as e:
        # Log the error and send it in the response
        print(f"Error during Firebase Hosting scan: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")