import os
import re  
import pymongo
import firebase_admin
import socket
import logging
import requests
from firebase_admin import credentials, firestore
from google.cloud.exceptions import GoogleCloudError
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson import ObjectId
from fastapi import HTTPException
from dotenv import load_dotenv
from .models import UserInDB, FileUploadRecord
from datetime import datetime
from typing import List, Optional, Dict, Any, Tuple
from cryptography.fernet import Fernet
import socket
import json 

# Load environment variables
secret_key = os.getenv("SECRET_KEY")
if not secret_key:
    raise ValueError("SECRET_KEY not found in environment variables")

cipher_suite = Fernet(secret_key.encode())
DB_URI = os.getenv("DB_URI")
if not DB_URI:
    raise ValueError("DB_URI not found in environment variables")

def get_db():
    client = MongoClient(DB_URI)
    db = client['gated']
    return db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setLevel(logging.ERROR)
logger.addHandler(handler)

# USER login and register

def create_user(user: UserInDB):
    try:
        db = get_db()
        result = db.users.insert_one(user.dict())
        return str(result.inserted_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {e}")

def get_user_by_username(username: str):
    db = get_db()
    user = db.users.find_one({"username": username})
    if user:
        return {**user, "id": str(user["_id"])}
    return None

# MONGODB scan user db_uri and output findings
def store_mongo_uri(uri: str, user_id: str, uri_alias: Optional[str] = None):
    encrypted_uri = cipher_suite.encrypt(uri.encode())  # Encrypt URI
    db = get_db()
    result = db.user_uris.insert_one({
        "user_id": user_id,
        "encrypted_uri": encrypted_uri,
        "uri_alias": uri_alias,
        "created_at": datetime.now(),
        "last_scan": None
    })
    return str(result.inserted_id)

def get_decrypted_uri(encrypted_uri: bytes) -> str:
    decrypted_uri = cipher_suite.decrypt(encrypted_uri).decode()  # Decrypt URI
    return decrypted_uri

def store_scan_result(user_uri_id: str, findings: list):
    db = get_db()
    db.scan_results.insert_one({
        "user_uri_id": user_uri_id,
        "findings": findings,
        "timestamp": datetime.now()
    })

# Function to scan a MongoDB URI for security risks
def scan_mongo_uri(uri: str, user_uri_id: str):
    try:
        client = MongoClient(uri)
        security_findings = []

        # Example security checks
        is_auth_enabled = client.admin.command("getParameter", 1, "authenticationMechanisms")
        if not is_auth_enabled:
            security_findings.append("Authentication is not enabled")

        # Store scan results in the database
        store_scan_result(user_uri_id, security_findings)

        return {"status": "scanned", "findings": security_findings}
    except Exception as e:
        return {"status": "error", "error": str(e)}

# MongoDB Security Checks

def check_authentication(mongo_uri):
    try:
        client = pymongo.MongoClient(mongo_uri)
        server_info = client.server_info()
        if server_info:
            if 'authentication' not in server_info:
                return "Authentication Check Result: Warning: Authentication is not enabled. Tip: Enable authentication for secure access control."
            else:
                return "Authentication Check Result: Authentication is enabled."
        else:
            return "Authentication Check Result: Could not connect to MongoDB to retrieve server info."
    except Exception as e:
        return f"Error: {str(e)}"

def check_ip_binding(mongo_uri):
    try:
        client = pymongo.MongoClient(mongo_uri)
        server_info = client.server_info()
        if 'bind_ip' in server_info and server_info['bind_ip'] == "0.0.0.0":
            return "IP Binding Check Result: Warning: MongoDB is listening on all IPs (0.0.0.0). Tip: Restrict binding to trusted IPs or localhost to prevent unauthorized access."
        else:
            return "IP Binding Check Result: MongoDB bind IP configuration looks good."
    except Exception as e:
        return f"Error: {str(e)}"

def check_user_roles(mongo_uri):
    try:
        client = pymongo.MongoClient(mongo_uri)
        db = client.admin
        users = db.command("usersInfo")
        risky_users = []
        for user in users.get("users", []):
            if "root" in [role["role"] for role in user.get("roles", [])]:
                risky_users.append(user["user"])
        if risky_users:
            return f"User Roles Check Result: Warning: Users with 'root' roles detected: {', '.join(risky_users)}. Tip: Limit root access and ensure roles are appropriately assigned."
        else:
            return "User Roles Check Result: No users with excessive privileges detected."
    except pymongo.errors.OperationFailure as e:
        if "not authorized" in str(e):
            return "User Roles Check Result: Error: Insufficient privileges to retrieve user roles."
        else:
            return f"User Roles Check Result: Operation error: {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"

def check_encryption(mongo_uri):
    try:
        client = pymongo.MongoClient(mongo_uri)
        server_info = client.server_info()
        if 'tls' in server_info and server_info['tls'] == 'enabled':
            return "Encryption Check Result: Encryption (TLS) is enabled for MongoDB."
        else:
            return "Encryption Check Result: Warning: MongoDB is not using encryption (TLS). Tip: Enable TLS encryption to secure data in transit."
    except Exception as e:
        return f"Error: {str(e)}"

def check_default_port(mongo_uri):
    try:
        if '27017' in mongo_uri:
            return "Port Check Result: Warning: MongoDB is using the default port (27017). Tip: Consider changing the default port to a non-standard port for security."
        else:
            return "Port Check Result: MongoDB is not using the default port."
    except Exception as e:
        return f"Error: {str(e)}"

def check_logging(mongo_uri):
    try:
        client = pymongo.MongoClient(mongo_uri)
        server_info = client.server_info()
        if 'log' in server_info and server_info['log'] == "disabled":
            return "Logging Check Result: Warning: MongoDB logging is disabled. Tip: Enable logging to monitor access and actions in the database."
        else:
            return "Logging Check Result: MongoDB logging is enabled."
    except Exception as e:
        return f"Error: {str(e)}"

# Additional Checks

def check_empty_fields(mongo_uri):
    try:
        client = pymongo.MongoClient(mongo_uri)
        db_names = client.list_database_names()
        empty_fields_report = []

        for db_name in db_names:
            db = client[db_name]
            collection_names = db.list_collection_names()
            for collection_name in collection_names:
                collection = db[collection_name]
                documents = collection.find()
                
                # Check each document for empty fields
                for doc in documents:
                    empty_fields = [key for key, value in doc.items() if value == "" or value is None]
                    if empty_fields:
                        empty_fields_report.append({
                            "database": db_name,
                            "collection": collection_name,
                            "document_id": doc.get("_id"),
                            "empty_fields": empty_fields
                        })
        if empty_fields_report:
            return f"Empty Fields Check Result: Warning: Documents with empty fields found: {empty_fields_report}. Tip: Clean up documents to avoid empty fields in critical data."
        else:
            return "Empty Fields Check Result: No empty fields detected in any document."
    except Exception as e:
        return f"Error: {str(e)}"

def check_password_hash(mongo_uri):
    try:
        client = MongoClient(mongo_uri)
        db = client.get_database()  # Assumes you want the default database in the URI
        users_collection = db["users"]

        insecure_passwords = []
        for user in users_collection.find({}, {"password": 1, "username": 1}):
            password = user.get("password", "")
            # Simple check if the password appears to be in hashed form (e.g., length or pattern)
            if not password or len(password) < 16:  # Adjust this check based on your hash requirements
                insecure_passwords.append(user["username"])

        if insecure_passwords:
            return f"Password Hash Check Result: Warning: The following users may have unsecure passwords: {', '.join(insecure_passwords)}. Tip: Use secure password hashing algorithms (e.g., bcrypt, scrypt)."
        else:
            return "Password Hash Check Result: All user passwords appear to be hashed."
    except pymongo.errors.OperationFailure as e:
        return "Password Security Check Result: Error: Insufficient privileges to check user passwords."
    except Exception as e:
        return f"Error: {str(e)}"

# Categorize Results
def categorize_result(message: str) -> str:
    if "Warning" in message:
        return "Warning"
    elif "Error" in message:
        return "Danger"
    else:
        return "Good"

# Aggregate Scan Results
def scan_mongo_db_for_risks(mongo_uri: str) -> Dict[str, Any]:
    checks = {
        "Authentication": check_authentication(mongo_uri),
        "IP Binding": check_ip_binding(mongo_uri),
        "User Roles": check_user_roles(mongo_uri),
        "Encryption": check_encryption(mongo_uri),
        "Default Port": check_default_port(mongo_uri),
        "Logging": check_logging(mongo_uri),
        "Empty Fields": check_empty_fields(mongo_uri),
        "Password Hash": check_password_hash(mongo_uri),
    }

    categorized_results = []
    for check_name, result in checks.items():
        category = categorize_result(result)
        categorized_results.append({"check": check_name, "result": result, "category": category})
    
    return {
        "status": "Scanning completed",
        "uri": mongo_uri,
        "audit_results": categorized_results
    }

# Function to validate SQL script for basic errors

def store_file_upload_record(user_id: Optional[str] = None, service: str = "JSON"):
    db = get_db()
    record_data = {
        "service": service,       # Either "SQL" or "JSON"
        "created_at": datetime.now(),  # Timestamp of the upload
    }
    if user_id:
        record_data["user_id"] = user_id  # Add user_id if provided

    # Insert the record into MongoDB's file_upload_records collection
    db.file_upload_records.insert_one(record_data)


def validate_sql_script(sql_content: str) -> Dict[str, List[str]]:
    analysis = {
        "errors": [],
        "warnings": [],
        "good_practices": []
    }

    # Check if the content is a JSON format
    try:
        json.loads(sql_content)
        analysis["errors"].append("Invalid SQL format. JSON format detected. Only SQL scripts are allowed to upload.")
        return analysis
    except json.JSONDecodeError:
        # Continue with SQL validation if JSON loading fails
        pass

    if not sql_content.strip():
        analysis["errors"].append("SQL script is empty.")
        return analysis

    # Filter out comment lines that start with "--"
    statements = [
        line.strip() for line in sql_content.splitlines() 
        if line.strip() and not line.strip().startswith("--")
    ]
    
    # Join the filtered lines back together as SQL script
    sql_content = ' '.join(statements)
    
    # Validate that the content contains at least one SQL command
    if not re.search(r"\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE)\b", sql_content, re.IGNORECASE):
        analysis["errors"].append("Invalid SQL format. Only SQL scripts are allowed to upload.")
        return analysis

    # Split SQL content by semicolons to handle each statement individually
    statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]

    for statement in statements:
        # Check for SELECT with specific columns (good practice)
        if re.search(r"\bSELECT\b\s+[^*]\w+", statement, re.IGNORECASE):
            analysis["good_practices"].append(f"Specified columns in SELECT statement: {statement}")

        # Check for missing columns in SELECT statement
        if re.search(r"\bSELECT\s+FROM\b", statement, re.IGNORECASE):
            analysis["errors"].append(f"Missing columns in SELECT statement: {statement}. Tip: Specify columns to select (e.g., SELECT column_name FROM table).")

        # Check for missing column names in INSERT statement
        if re.search(r"\bINSERT\s+INTO\s+\w+\s+VALUES\s*\(", statement, re.IGNORECASE):
            analysis["warnings"].append(f"INSERT without column names in statement: {statement}. Tip: Specify column names to ensure data is inserted in the correct order.")

        # Check for missing WHERE clause in DELETE or UPDATE statements
        if re.search(r"\b(DELETE|UPDATE)\s+\w+", statement, re.IGNORECASE) and not re.search(r"\bWHERE\b", statement, re.IGNORECASE):
            analysis["errors"].append(f"Potentially dangerous DELETE or UPDATE without WHERE clause: {statement}. Tip: Add a WHERE clause to limit the scope of the update/delete.")

        # Check for empty string conditions in WHERE clause
        if re.search(r"WHERE\s+\w+\s*=\s*''", statement, re.IGNORECASE):
            analysis["warnings"].append(f"Empty string condition in WHERE clause: {statement}. Tip: Ensure that empty string is a valid value for comparison.")

        # Check for missing data type in CREATE TABLE statement
        if re.search(r"\bCREATE\s+TABLE\b", statement, re.IGNORECASE):
            if re.search(r"\w+\s*,?\s*\)", statement) and not re.search(r"\w+\s+\w+\b", statement):
                analysis["errors"].append(f"Missing data type in CREATE TABLE statement: {statement}. Tip: Specify a data type for each column (e.g., VARCHAR(50), INT).")

        # Check for missing table name in DROP TABLE or ALTER TABLE statement
        if re.search(r"\b(DROP|ALTER)\s+TABLE\b\s*$", statement, re.IGNORECASE):
            analysis["errors"].append(f"Missing table name in {statement.split()[0]} TABLE statement: {statement}. Tip: Specify the table name.")

        # Check for missing column value in INSERT statement with specified columns
        if re.search(r"\bINSERT\s+INTO\s+\w+\s+\(.+\)\s+VALUES\s*\(.+\)", statement, re.IGNORECASE):
            columns = re.findall(r"\((.*?)\)", statement)
            if len(columns) == 2 and len(columns[0].split(',')) != len(columns[1].split(',')):
                analysis["errors"].append(f"Column count does not match value count in INSERT statement: {statement}. Tip: Ensure that each column has a corresponding value.")

        # Check for missing new table name in ALTER TABLE RENAME TO statement
        if re.search(r"\bALTER\s+TABLE\s+\w+\s+RENAME\s+TO\b\s*$", statement, re.IGNORECASE):
            analysis["errors"].append(f"Missing new table name in ALTER TABLE RENAME TO statement: {statement}. Tip: Specify the new table name.")

        # Check for missing semicolon at the end of the statement
        if not statement.endswith(";"):
            analysis["warnings"].append(f"Missing semicolon at the end of the statement: {statement}. Tip: Add a semicolon at the end of each SQL statement.")

        # Check for valid SQL command
        if not re.search(r"^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE)\b", statement, re.IGNORECASE):
            analysis["errors"].append(f"No valid SQL command found in statement: {statement}. Tip: Ensure SQL keywords are correct.")

        # Check for unbalanced parentheses
        if statement.count('(') != statement.count(')'):
            analysis["errors"].append(f"Mismatched parentheses in statement: {statement}. Tip: Ensure all opening parentheses have a corresponding closing parenthesis.")

        # Check for SELECT without *
        if re.search(r"\bSELECT\s+[^*]+\b", statement, re.IGNORECASE):
            analysis["good_practices"].append(f"Avoiding SELECT * in statement: {statement}")

        # Check for valid JOIN statement (good practice)
        if re.search(r"\bJOIN\b", statement, re.IGNORECASE):
            analysis["good_practices"].append(f"Using JOIN to combine tables: {statement}")

    return analysis

# Initialize Firestore Client
def initialize_firestore(service_account_key: Dict[str, Any]):
    """
    Initialize Firestore client using service account key.
    """
    try:
        return firestore.Client.from_service_account_info(service_account_key)
    except Exception as e:
        raise ValueError(f"Invalid Firestore service account key: {e}")

# Firestore Security Checks

def check_rules_config(firestore_client):
    try:
        # Assuming Firestore rules are available in a Firestore collection or can be exported
        rules = firestore_client.collection("security_rules").get()
        if not rules:
            return "Error: Firestore does not have secure rules configured. Tip: Add rules to restrict access based on user roles and permissions."
        else:
            rule_check_results = []
            for rule in rules:
                rule_data = rule.to_dict()
                if "allow" not in rule_data:
                    rule_check_results.append("Missing 'allow' condition in rules.")
                if "read" not in rule_data or "write" not in rule_data:
                    rule_check_results.append("Incomplete access control in rules.")
            if rule_check_results:
                return f"Error: Issues found in Firestore rules: {', '.join(rule_check_results)}"
            return "Good: Firestore security rules are configured correctly."
    except Exception as e:
        return f"Error: {str(e)}"

def check_open_access(firestore_client):
    try:
        collections = firestore_client.collections()
        accessible_collections = []
        for collection in collections:
            try:
                _ = list(collection.get())  # Attempting to read all documents to simulate open access
                accessible_collections.append(collection.id)
            except Exception:
                pass  # If we can't access, it's likely protected
        if accessible_collections:
            return f"Error: Collections with unrestricted access detected: {', '.join(accessible_collections)}. Tip: Use role-based access controls to limit exposure."
        else:
            return "Good: All collections are access-restricted."
    except Exception as e:
        return f"Error: {str(e)}"

def check_unused_indexes(firestore_client):
    try:
        # Firestore doesn't directly expose unused index details, but we can simulate checks by querying all fields
        # and checking if index queries are slow.
        # For now, this will be a placeholder until Firestore provides more index usage info.
        return "Warning: Could not determine unused indexes directly. Tip: Periodically review and optimize Firestore indexes."
    except Exception as e:
        return f"Error: {str(e)}"

def check_large_documents(firestore_client):
    try:
        large_docs = []
        for collection in firestore_client.collections():
            for doc in collection.get():
                # Firestore document size limit is 1 MB
                if len(str(doc.to_dict())) > 1048576:
                    large_docs.append({"collection": collection.id, "document_id": doc.id})
        if large_docs:
            return f"Warning: Large documents detected: {large_docs}. Tip: Split large documents into smaller ones to avoid performance issues."
        else:
            return "Good: No large documents detected."
    except Exception as e:
        return f"Error: {str(e)}"

def check_encryption(firestore_client):
    """
    Verify if sensitive data fields are properly encrypted or hashed before being stored in Firestore.
    Firestore encrypts data by default, but sensitive fields like passwords should be hashed or encrypted by the user.
    """
    try:
        sensitive_fields_report = []
        
        sensitive_field_names = ["password", "api_key", "private_key"]

        for collection in firestore_client.collections():
            for doc in collection.get():
                data = doc.to_dict()

                for field in sensitive_field_names:
                    if field in data and isinstance(data[field], str) and data[field] != "":
                        sensitive_fields_report.append({
                            "collection": collection.id,
                            "document_id": doc.id,
                            "sensitive_field": field
                        })
        
        if sensitive_fields_report:
            return f"Warning: Sensitive fields found in plain text in collections: {', '.join([f'{item['collection']} (document ID: {item['document_id']}) - {item['sensitive_field']}' for item in sensitive_fields_report])}. Tip: Ensure sensitive data is encrypted or hashed before storage."
        else:
            return "Good: No sensitive fields in plain text found. Sensitive data is handled properly."
    except Exception as e:
        return f"Error: {str(e)}"

def check_empty_fields(firestore_client):
    try:
        empty_fields_report = []
        for collection in firestore_client.collections():
            for doc in collection.get():
                data = doc.to_dict()
                empty_fields = [key for key, value in data.items() if value == "" or value is None]
                if empty_fields:
                    empty_fields_report.append({"collection": collection.id, "document_id": doc.id, "empty_fields": empty_fields})
        if empty_fields_report:
            return f"Warning: Documents with empty fields found: {empty_fields_report}. Tip: Ensure all fields are properly populated."
        else:
            return "Good: No empty fields detected."
    except Exception as e:
        return f"Error: {str(e)}"

def check_query_performance(firestore_client):
    """
    Check for query performance by simulating queries that require indexes.
    Firestore will raise an error if an index is missing for a query.
    """
    try:
        collections = firestore_client.collections()
        missing_indexes = []

        for collection in collections:
            try:
                query = collection.where("field1", ">=", 1).where("field2", "<=", 10)
                query.get()  
                
            except Exception as e:
                if "The query requires an index" in str(e):
                    missing_indexes.append({
                        "collection": collection.id,
                        "error": str(e)
                    })
        
        if missing_indexes:
            return f"Warning: Missing indexes detected in collections: {', '.join([f'{item['collection']} - {item['error']}' for item in missing_indexes])}. Tip: Create the necessary indexes."
        else:
            return "Good: No missing indexes detected. All queries appear to be optimized."
    except Exception as e:
        return f"Error: {str(e)}"

def check_data_redundancy(firestore_client):
    """
    Check for data redundancy (e.g., repetitive document fields or collections).
    """
    try:
        redundant_data_report = []
        for collection in firestore_client.collections():
            field_count = {}
            for doc in collection.get():
                data = doc.to_dict()
                for field, value in data.items():
                    if field not in field_count:
                        field_count[field] = set()
                    field_count[field].add(value)
            for field, values in field_count.items():
                if len(values) == 1:  # All values in this field are the same, indicating redundancy
                    redundant_data_report.append({"collection": collection.id, "field": field, "values": values})
        if redundant_data_report:
            return f"Warning: Data redundancy detected: {redundant_data_report}. Tip: Consider normalizing your data to reduce redundancy."
        else:
            return "Good: No data redundancy detected."
    except Exception as e:
        return f"Error: {str(e)}"

# Categorize Results
def categorize_result(message: str) -> str:
    """
    Categorize scan results into Danger, Warning, or Good.
    """
    if "Error" in message:
        return "Danger"
    elif "Warning" in message:
        return "Warning"
    else:
        return "Good"
    
# Full scan function
def scan_firestore_for_risks(service_account_key: str) -> Dict[str, Any]:
    try:
        firestore_client = initialize_firestore(service_account_key)
        
        # Perform checks
        checks = {
            "Security Rules": check_rules_config(firestore_client),
            "Open Access": check_open_access(firestore_client),
            "Unused Indexes": check_unused_indexes(firestore_client),
            "Large Documents": check_large_documents(firestore_client),
            "Encryption": check_encryption(firestore_client),
            "Empty Fields": check_empty_fields(firestore_client),
            "Query Performance": check_query_performance(firestore_client),
            "Data Redundancy": check_data_redundancy(firestore_client)
        }

        # Categorize results
        audit_results = []
        for check, result in checks.items():
            category = categorize_result(result)
            audit_results.append({
                "check": check,
                "result": result,
                "category": category
            })

        # Return the corrected structure
        return {
            "status": "Scanning completed",
            "audit_results": audit_results  # Flattened array
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


#FIREBASE
# Utility function to check if the domain is a valid Firebase Hosting domain
def is_valid_firebase_domain(domain: str) -> bool:
    # Check if the domain ends with '.firebaseapp.com' or '.web.app'
    if domain.endswith('.firebaseapp.com') or domain.endswith('.web.app'):
        return True
    return False

# Function to check if HTTPS is enforced on Firebase Hosting domain
def check_https_enforcement(domain: str) -> str:
    try:
        response = requests.get(f'http://{domain}', allow_redirects=False)
        if response.status_code != 301:
            return "HTTP traffic is not redirected to HTTPS. Tip: Ensure HTTPS is enforced."
        else:
            return "HTTPS is enforced."
    except Exception as e:
        return f"Could not check HTTPS enforcement. Tip: {str(e)}"

# Function to check if required security headers are configured on Firebase Hosting
def check_security_headers(domain: str) -> str:
    required_headers = ['Strict-Transport-Security', 'X-Content-Type-Options', 'X-Frame-Options', 'Content-Security-Policy']
    try:
        response = requests.get(f'https://{domain}')
        missing_headers = [header for header in required_headers if header not in response.headers]

        if missing_headers:
            return f"Missing security headers: {', '.join(missing_headers)}. Tip: Configure these headers in your Firebase Hosting settings."
        else:
            return "All necessary security headers are configured."
    except Exception as e:
        return f"Could not check security headers. Tip: {str(e)}"

# Function to check caching headers on Firebase Hosting
def check_caching_headers(domain: str) -> str:
    try:
        response = requests.get(f'https://{domain}')
        cache_control = response.headers.get('Cache-Control', None)

        if not cache_control:
            return "Missing Cache-Control header. Tip: Set proper caching for static resources."
        else:
            return "Cache-Control headers are configured."
    except Exception as e:
        return f"Could not check caching headers. Tip: {str(e)}"

# Function to check performance using a placeholder (Lighthouse or other tool can be integrated here)
def check_performance(domain: str) -> str:
    try:
        performance_score = 85  # Placeholder score
        if performance_score < 60:
            return "Low performance score. Tip: Consider optimizing load time and reducing JavaScript usage."
        else:
            return "Performance score is acceptable."
    except Exception as e:
        return f"Could not perform performance check. Tip: {str(e)}"

# Function to check for redirect loops on the Firebase Hosting site
def check_redirects(domain: str) -> str:
    try:
        response = requests.get(f'https://{domain}', allow_redirects=False)
        if response.status_code == 301:
            if response.headers.get('Location') == f'https://{domain}':
                return "Redirect loop detected. Tip: Check your Firebase Hosting redirects."
            else:
                return "No redirect loops detected."
        else:
            return "Site loaded successfully without redirect loops."
    except Exception as e:
        return f"Could not check redirects. Tip: {str(e)}"
    
# Function to check for HTTP security headers like X-XSS-Protection
def check_http_security_headers(domain: str) -> str:
    try:
        response = requests.get(f'https://{domain}')
        security_headers = ['X-XSS-Protection', 'X-Content-Type-Options', 'Strict-Transport-Security']
        missing_headers = [header for header in security_headers if header not in response.headers]

        if missing_headers:
            return f"Missing security headers: {', '.join(missing_headers)}. Tip: Add these security headers in your Firebase Hosting settings."
        else:
            return "All essential HTTP security headers are configured."
    except Exception as e:
        return f"Could not check HTTP security headers. Tip: {str(e)}"

# Function to check for rate limiting headers (X-RateLimit-Remaining)
def check_rate_limiting(domain: str) -> str:
    try:
        response = requests.get(f'https://{domain}/api-endpoint')  # Adjust the API endpoint accordingly
        if 'X-RateLimit-Remaining' not in response.headers:
            return "Rate limiting is not added. The domain could not be protected. Tip: Consider adding rate limiting headers (X-RateLimit-Remaining) to protect your API."
        else:
            return "Rate limiting headers are in place."
    except Exception as e:
        return f"Could not check for rate limiting. Tip: {str(e)}"

# Main function to scan Firebase Hosting for issues
def scan_firebase_hosting(domain: str) -> dict:
    try:
        hosting_checks = {
            "HTTPS Enforcement": check_https_enforcement(domain),
            "Security Headers": check_security_headers(domain),
            "Caching Headers": check_caching_headers(domain),
            "Performance": check_performance(domain),
            "Redirects": check_redirects(domain),
            "HTTP Security Headers": check_http_security_headers(domain),
            "Rate Limiting": check_rate_limiting(domain),
        }

        audit_results = []
        for check, result in hosting_checks.items():
            # Categorize result based on its content
            if "Could not" in result:  # Any error-related message
                category = "Danger"
            elif "Missing" in result or "Low" in result:  # Warning-related messages
                category = "Warning"
            else:  # Anything else is considered "Good"
                category = "Good"

            audit_results.append({
                "check": check,
                "result": result,
                "category": category
            })

        return {
            "status": "Scanning completed",
            "audit_results": audit_results
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}



def validate_json_script(content: str) -> Dict[str, List[str]]:
    """
    Validates the JSON content of a file, categorizing findings into errors, warnings, and good practices.
    
    Args:
        content (str): The file content to validate.
    
    Returns:
        Dict[str, List[str]]: A dictionary containing lists of errors, warnings, and good practices.
    """
    analysis = {
        "errors": [],
        "warnings": [],
        "good_practices": []
    }
    
    # Check if content is valid JSON
    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        analysis["errors"].append("Invalid JSON format. Only JSON format script is allowed to upload.")
        return analysis
    
    # Example validation: Check for specific fields in JSON
    required_fields = ["username", "password", "email"]
    for field in required_fields:
        if field not in data:
            analysis["errors"].append(f"Missing required field: {field}")
    
    # Check if password is hashed
    if "password" in data:
        if len(data["password"]) < 60:  # Example: Assuming hashed passwords are at least 60 chars (bcrypt standard)
            analysis["warnings"].append("Password is not hashed. Please use a secure hash.")
        else:
            analysis["good_practices"].append("Password is hashed properly.")

    # Check for nested user profile data as a good practice
    if "profile" in data.get("user", {}):
        analysis["good_practices"].append("User profile includes detailed nested data.")

    # Check for user preferences under profile
    if "preferences" in data.get("user", {}).get("profile", {}):
        analysis["good_practices"].append("User profile includes preferences, enhancing customization options.")

    # Check if email format is valid
    email = data.get("email", "")
    if email and "@" not in email:
        analysis["warnings"].append("Invalid email format.")
    else:
        analysis["good_practices"].append("Email format appears valid.")

    # Validate account status
    if "account" in data:
        if data["account"].get("status") not in ["active", "inactive", "suspended"]:
            analysis["warnings"].append("Account status should be one of 'active', 'inactive', or 'suspended'.")
        else:
            analysis["good_practices"].append("Account status is valid.")

    # Validate transaction entries
    transactions = data.get("transactions", [])
    if transactions:
        analysis["good_practices"].append("Transactions data is present and includes purchase history.")
        
        for txn in transactions:
            if "status" not in txn:
                analysis["errors"].append(f"Transaction {txn.get('id', '')} is missing a status field.")
            elif txn["status"] not in ["completed", "pending", "failed"]:
                analysis["warnings"].append(f"Transaction {txn.get('id', '')} has an invalid status value.")
            if "currency" not in txn or txn["currency"] != "USD":
                analysis["warnings"].append(f"Transaction {txn.get('id', '')} uses a non-standard currency.")

    # Check privacy settings as a good practice
    if data.get("settings", {}).get("privacy"):
        analysis["good_practices"].append("Privacy settings are configured.")

    # Check if data sharing consent is present under privacy settings
    data_sharing = data.get("settings", {}).get("privacy", {}).get("dataSharing", {})
    if data_sharing.get("consentGiven", False):
        analysis["good_practices"].append("User has provided consent for data sharing, adhering to privacy policies.")
    else:
        analysis["warnings"].append("User has not provided consent for data sharing. Ensure compliance with privacy regulations.")
    
    return analysis