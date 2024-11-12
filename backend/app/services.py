import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
from .models import UserInDB

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI from environment variables
DB_URI = os.getenv("DB_URI")

def get_db():
    # Use the MongoClient with the connection string
    client = MongoClient(DB_URI)
    db = client['cloud_risk_assessment']
    return db

def create_user(user: UserInDB):
    db = get_db()
    users_collection = db['users']
    user_dict = user.dict(exclude_unset=True)
    result = users_collection.insert_one(user_dict)
    return str(result.inserted_id)

def get_user_by_username(username: str):
    db = get_db()
    users_collection = db['users']
    return users_collection.find_one({"username": username})