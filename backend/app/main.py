import uvicorn
import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
print(f"Loading .env from: {env_path}")
load_dotenv(env_path)

from pymongo import MongoClient
from fastapi import FastAPI, HTTPException
from uvicorn.config import Config
from .routes import user_router, mongo_scan_router
from urllib.parse import urlparse
from cryptography.fernet import Fernet

# Debugging: Check if the environment variables are loaded
print(f"SECRET_KEY: {os.getenv('SECRET_KEY')}")
print(f"DB_URI: {os.getenv('DB_URI')}")

# FastAPI app initialization
app = FastAPI()
app.include_router(user_router, prefix="/users")
app.include_router(mongo_scan_router, prefix="/scan")

# SECRET_KEY validation
secret_key = os.getenv("SECRET_KEY")
if not secret_key:
    print("SECRET_KEY not found in .env file.")
    secret_key = Fernet.generate_key().decode()  # Generate a new secret key if not found
    print(f"Generated SECRET_KEY: {secret_key}")
else:
    print(f"SECRET_KEY loaded: {secret_key}")

cipher_suite = Fernet(secret_key.encode())

# Database connection during startup
@app.on_event("startup")
async def startup_db():
    try:
        # Get DB_URI from environment variables
        db_uri = os.getenv("DB_URI")
        if not db_uri:
            raise ValueError("DB_URI not found in environment variables")

        # Try connecting to MongoDB
        client = MongoClient(db_uri)
        client.list_database_names()  # This will trigger a connection attempt

        # Parse the URI for printing connection info
        parsed_uri = urlparse(db_uri)
        cluster_info = f"{parsed_uri.scheme}://{parsed_uri.hostname}"
        print(f"Connected to MongoDB cluster: {cluster_info}")

    except Exception as e:
        print(f"Error connecting to database: {e}")

# Simple root endpoint
@app.get("/")
async def root():
    return {"message": "Hello, World!"}

# Stop Uvicorn server gracefully (if needed)
def stop_uvicorn():
    uvicorn.Server(Config(app="main:app")).handle_exit(None)

# To run the server, use:
# uvicorn main:app --reload
