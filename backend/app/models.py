from pydantic import BaseModel
from bson import ObjectId
from typing import List, Optional, Dict, Any
from datetime import datetime

# USER login and register

class User(BaseModel):
    username: str
    password: str
    role: str = "user"

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserInDB(BaseModel):
    username: str
    password: str
    role: str
    id: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# MONGODB scan user db_uri and output findings

class UserURI(BaseModel):
    user_id: str
    encrypted_uri: str
    uri_alias: Optional[str] = None
    last_scan: Optional[datetime] = None
    created_at: datetime = datetime.now()

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Finding(BaseModel):
    check: str
    result: str
    category: str

class ScanResult(BaseModel):
    user_uri_id: str  # Update this to match the field being passed
    service: str
    findings: Dict[str, List[Finding]]  # Keeping the structured findings field
    timestamp: datetime = datetime.now()

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class MongoDBRequest(BaseModel):
    mongodb_uri: str


class FileUploadRecord(BaseModel):
    # user_id: str  # Uncomment when needed
    service: str  # Either "SQL" or "JSON"
    created_at: datetime = datetime.now()

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class FirestoreScanRequest(BaseModel):
    firestore_key: Dict[str, Any]

class FirebaseHostingScanRequest(BaseModel):
    domain: str
