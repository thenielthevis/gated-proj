import os
import re  
import pymongo
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson import ObjectId
from fastapi import HTTPException
from dotenv import load_dotenv
from .models import UserInDB
from datetime import datetime
from typing import List, Optional, Dict, Any
from cryptography.fernet import Fernet
import socket

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
                return "Authentication Check Result: Warning: Authentication is not enabled. \nTip: Enable authentication for secure access control."
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
            return "IP Binding Check Result: Warning: MongoDB is listening on all IPs (0.0.0.0). \nTip: Restrict binding to trusted IPs or localhost to prevent unauthorized access."
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
            return f"User Roles Check Result: Warning: Users with 'root' roles detected: {', '.join(risky_users)}. \nTip: Limit root access and ensure roles are appropriately assigned."
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
            return "Encryption Check Result: Warning: MongoDB is not using encryption (TLS). \nTip: Enable TLS encryption to secure data in transit."
    except Exception as e:
        return f"Error: {str(e)}"

def check_default_port(mongo_uri):
    try:
        if '27017' in mongo_uri:
            return "Port Check Result: Warning: MongoDB is using the default port (27017). \nTip: Consider changing the default port to a non-standard port for security."
        else:
            return "Port Check Result: MongoDB is not using the default port."
    except Exception as e:
        return f"Error: {str(e)}"

def check_logging(mongo_uri):
    try:
        client = pymongo.MongoClient(mongo_uri)
        server_info = client.server_info()
        if 'log' in server_info and server_info['log'] == "disabled":
            return "Logging Check Result: Warning: MongoDB logging is disabled. \nTip: Enable logging to monitor access and actions in the database."
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
            return f"Empty Fields Check Result: Warning: Documents with empty fields found: {empty_fields_report}. \nTip: Clean up documents to avoid empty fields in critical data."
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
            return f"Password Hash Check Result: Warning: The following users may have unsecure passwords: {', '.join(insecure_passwords)}. \nTip: Use secure password hashing algorithms (e.g., bcrypt, scrypt)."
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

def validate_sql_script(sql_content: str) -> Dict[str, List[str]]:
    analysis = {
        "errors": [],
        "warnings": [],
        "good_practices": []
    }

    if not sql_content:
        analysis["errors"].append("SQL script is empty.")
        return analysis

    # Split SQL content by semicolons to handle each statement individually
    statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]

    for statement in statements:
        # Check for SELECT with specific columns (good practice)
        if re.search(r"\bSELECT\b\s+[^*]\w+", statement, re.IGNORECASE):
            analysis["good_practices"].append(f"Specified columns in SELECT statement: {statement}")

        # Check for missing columns in SELECT statement
        if re.search(r"\bSELECT\s+FROM\b", statement, re.IGNORECASE):
            analysis["errors"].append(f"Missing columns in SELECT statement: {statement}. \nTip: Specify columns to select (e.g., SELECT column_name FROM table).")

        # Check for missing column names in INSERT statement
        if re.search(r"\bINSERT\s+INTO\s+\w+\s+VALUES\s*\(", statement, re.IGNORECASE):
            analysis["warnings"].append(f"INSERT without column names in statement: {statement}. \nTip: Specify column names to ensure data is inserted in the correct order.")

        # Check for missing WHERE clause in DELETE or UPDATE statements
        if re.search(r"\b(DELETE|UPDATE)\s+\w+", statement, re.IGNORECASE) and not re.search(r"\bWHERE\b", statement, re.IGNORECASE):
            analysis["errors"].append(f"Potentially dangerous DELETE or UPDATE without WHERE clause: {statement}. \nTip: Add a WHERE clause to limit the scope of the update/delete.")

        # Check for empty string conditions in WHERE clause
        if re.search(r"WHERE\s+\w+\s*=\s*''", statement, re.IGNORECASE):
            analysis["warnings"].append(f"Empty string condition in WHERE clause: {statement}. \nTip: Ensure that empty string is a valid value for comparison.")

        # Check for missing data type in CREATE TABLE statement
        if re.search(r"\bCREATE\s+TABLE\b", statement, re.IGNORECASE):
            if re.search(r"\w+\s*,?\s*\)", statement) and not re.search(r"\w+\s+\w+\b", statement):
                analysis["errors"].append(f"Missing data type in CREATE TABLE statement: {statement}. \nTip: Specify a data type for each column (e.g., VARCHAR(50), INT).")

        # Check for missing table name in DROP TABLE or ALTER TABLE statement
        if re.search(r"\b(DROP|ALTER)\s+TABLE\b\s*$", statement, re.IGNORECASE):
            analysis["errors"].append(f"Missing table name in {statement.split()[0]} TABLE statement: {statement}. \nTip: Specify the table name.")

        # Check for missing column value in INSERT statement with specified columns
        if re.search(r"\bINSERT\s+INTO\s+\w+\s+\(.+\)\s+VALUES\s*\(.+\)", statement, re.IGNORECASE):
            columns = re.findall(r"\((.*?)\)", statement)
            if len(columns) == 2 and len(columns[0].split(',')) != len(columns[1].split(',')):
                analysis["errors"].append(f"Column count does not match value count in INSERT statement: {statement}. \nTip: Ensure that each column has a corresponding value.")

        # Check for missing new table name in ALTER TABLE RENAME TO statement
        if re.search(r"\bALTER\s+TABLE\s+\w+\s+RENAME\s+TO\b\s*$", statement, re.IGNORECASE):
            analysis["errors"].append(f"Missing new table name in ALTER TABLE RENAME TO statement: {statement}. \nTip: Specify the new table name.")

        # Check for missing semicolon at the end of the statement
        if not statement.endswith(";"):
            analysis["warnings"].append(f"Missing semicolon at the end of the statement: {statement}. \nTip: Add a semicolon at the end of each SQL statement.")

        # Check for valid SQL command
        if not re.search(r"^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE)\b", statement, re.IGNORECASE):
            analysis["errors"].append(f"No valid SQL command found in statement: {statement}. \nTip: Ensure SQL keywords are correct.")


        # Check for unbalanced parentheses
        if statement.count('(') != statement.count(')'):
            analysis["errors"].append(f"Mismatched parentheses in statement: {statement}. \nTip: Ensure all opening parentheses have a corresponding closing parenthesis.")

        # Check for SELECT without *
        if re.search(r"\bSELECT\s+[^*]+\b", statement, re.IGNORECASE):
            analysis["good_practices"].append(f"Avoiding SELECT * in statement: {statement}")

        # Check for valid JOIN statement (good practice)
        if re.search(r"\bJOIN\b", statement, re.IGNORECASE):
            analysis["good_practices"].append(f"Using JOIN to combine tables: {statement}")

    return analysis
