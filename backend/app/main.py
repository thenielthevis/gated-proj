import uvicorn
import os
from pymongo import MongoClient
from fastapi import FastAPI
from uvicorn.config import Config
from .routes import user_router  # Import the user router from routes.py

app = FastAPI()

# Include the user router
app.include_router(user_router, prefix="/users")

# Root endpoint to test the server
@app.on_event("startup")
async def startup_db():
    try:
        db_uri = os.getenv("DB_URI")  # Assuming the DB_URI is set in your environment
        client = MongoClient(db_uri)
        # Test the connection by getting a list of databases
        client.list_database_names()  # This will throw an exception if the connection fails
        print(f"Connected to database: {db_uri}")
    except Exception as e:
        print(f"Error connecting to database: {e}")

@app.get("/")
async def root():
    return {"message": "Hello, World!"}

def stop_uvicorn():
    uvicorn.Server(Config(app="main:app")).handle_exit(None)

# To run the server, you can use:
# uvicorn main:app --reload
