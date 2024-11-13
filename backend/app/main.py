import uvicorn
import os
from pymongo import MongoClient
from fastapi import FastAPI
from uvicorn.config import Config
from dotenv import load_dotenv
from .routes import user_router  # Import the user router from routes.py
from urllib.parse import urlparse

# Initialize FastAPI app
app = FastAPI()
# Include the user router
app.include_router(user_router, prefix="/users")
# Load environment variables from the .env file in the backend folder
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

@app.on_event("startup")
async def startup_db():
    try:
        # Get the MongoDB URI from environment variables
        db_uri = os.getenv("DB_URI")
        if not db_uri:
            raise ValueError("DB_URI not found in environment variables")

        # Establish the MongoDB client connection
        client = MongoClient(db_uri)

        # Test the connection by attempting to list the databases
        client.list_database_names()

        # Parse the URI to safely print the cluster information only
        parsed_uri = urlparse(db_uri)
        cluster_info = f"{parsed_uri.scheme}://{parsed_uri.hostname}"
        print(f"Connected to MongoDB cluster: {cluster_info}")

    except Exception as e:
        print(f"Error connecting to database: {e}")

@app.get("/")
async def root():
    return {"message": "Hello, World!"}

def stop_uvicorn():
    uvicorn.Server(Config(app="main:app")).handle_exit(None)

# To run the server, you can use:
# uvicorn main:app --reload
