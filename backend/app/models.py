from pydantic import BaseModel
from bson import ObjectId
from typing import Optional

# Pydantic model for user data
class User(BaseModel):
    username: str
    password: str
    role: str = "user"  # Default role is "user", but can be "admin"

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserInDB(BaseModel):
    username: str
    password: str
    role: str
    id: Optional[str] = None  # MongoDB id is not required during object creation

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
