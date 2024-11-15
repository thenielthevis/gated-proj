import os
import jsonify
import mongoaudit
from flask import request
from fastapi import APIRouter, HTTPException, Request
from fastapi import FastAPI
from pydantic import BaseModel
from passlib.context import CryptContext
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from .models import User, UserInDB, MongoDBRequest
from .services import create_user, get_user_by_username, scan_mongo_db_for_risks 
import subprocess
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

@user_router.post("/register")
async def register(user: User):
    hashed_password = pwd_context.hash(user.password)
    user_in_db = UserInDB(username=user.username, password=hashed_password, role=user.role)

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
        audit_results = scan_mongo_db_for_risks(mongo_uri)  # Use the custom function
        
        # Return the scan results as a response
        return {"status": "Scanning completed", "uri": mongo_uri, "audit_results": audit_results}
    
    except Exception as e:
        # Log the error and send it in the response
        print(f"Error during scan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during scanning: {str(e)}")