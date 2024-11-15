import os
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