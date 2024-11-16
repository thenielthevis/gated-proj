import os
import re  
import pymongo
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

#MONGODB

def check_authentication(mongo_uri):
    try:
        client = pymongo.MongoClient(mongo_uri)
        server_info = client.server_info()
        if server_info:
            # MongoDB should be running with authentication enabled
            if 'authentication' not in server_info:
                return "Warning: Authentication is not enabled"
            else:
                return "Authentication is enabled"
        else:
            return "Could not connect to MongoDB to retrieve server info"
    except Exception as e:
        return f"Error: {str(e)}"

def check_ip_binding(mongo_uri):
    try:
        client = pymongo.MongoClient(mongo_uri)
        server_info = client.server_info()
        
        # Check if the bind IP is set to 0.0.0.0 (which is a potential security risk)
        if 'bind_ip' in server_info and server_info['bind_ip'] == "0.0.0.0":
            return "Warning: MongoDB is listening on all IPs (0.0.0.0). Consider restricting to local or trusted IPs."
        else:
            return "MongoDB bind IP configuration looks good."
    except Exception as e:
        return f"Error: {str(e)}"

def check_user_roles(mongo_uri):
    try:
        client = pymongo.MongoClient(mongo_uri)
        db = client.admin
        users = db.command("usersInfo")
        
        # Loop through users and check their roles
        risky_users = []
        for user in users.get("users", []):
            if "root" in user.get("roles", []):
                risky_users.append(user["user"])
        
        if risky_users:
            return f"Warning: The following users have 'root' roles: {', '.join(risky_users)}. They might have too many privileges."
        else:
            return "No users with excessive privileges detected."
    except Exception as e:
        return f"Error: {str(e)}"

def check_encryption(mongo_uri):
    try:
        client = pymongo.MongoClient(mongo_uri)
        server_info = client.server_info()
        
        # Check if encryption is enabled (e.g., TLS)
        if 'tls' in server_info and server_info['tls'] == 'enabled':
            return "Encryption (TLS) is enabled for MongoDB"
        else:
            return "Warning: MongoDB is not using encryption (TLS). Consider enabling it."
    except Exception as e:
        return f"Error: {str(e)}"

def check_default_port(mongo_uri):
    try:
        if '27017' in mongo_uri:
            return "Warning: MongoDB is using the default port (27017). Consider changing it for added security."
        else:
            return "MongoDB is not using the default port."
    except Exception as e:
        return f"Error: {str(e)}"

def check_logging(mongo_uri):
    try:
        client = pymongo.MongoClient(mongo_uri)
        server_info = client.server_info()
        
        # Check if logging is enabled for MongoDB (not logging could be a security risk)
        if 'log' in server_info and server_info['log'] == "disabled":
            return "Warning: MongoDB logging is disabled. This may hide important security logs."
        else:
            return "MongoDB logging is enabled."
    except Exception as e:
        return f"Error: {str(e)}"

def scan_mongo_db_for_risks(mongo_uri: str) -> Dict[str, Any]:
    # Perform multiple checks
    results = []
    
    results.append(check_authentication(mongo_uri))
    results.append(check_ip_binding(mongo_uri))
    results.append(check_user_roles(mongo_uri))
    results.append(check_encryption(mongo_uri))
    results.append(check_default_port(mongo_uri))
    results.append(check_logging(mongo_uri))
    
    # Return a comprehensive scan result
    return {"status": "Scanning completed", "uri": mongo_uri, "audit_results": results}

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