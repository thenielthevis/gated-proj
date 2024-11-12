import os
from pymongo import MongoClient
from bson import ObjectId
from fastapi import HTTPException
from dotenv import load_dotenv
from .models import UserInDB


# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI from environment variables
DB_URI = os.getenv("DB_URI")

def get_db():
    client = MongoClient(DB_URI)
    db = client['cloud_risk_assessment']
    return db

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
        return {**user, "id": str(user["_id"])}  # Convert _id to string
    return None
