from pydantic import BaseModel
from bson import ObjectId

# Pydantic model for user data
class User(BaseModel):
    username: str
    password: str
    role: str = "user"  # Default role is "user", but can be "admin"

    class Config:
        # Allow MongoDB ObjectId serialization and convert to string when serialized
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }

# For MongoDB object ID compatibility
class UserInDB(User):
    id: ObjectId

    class Config:
        # Allow MongoDB ObjectId serialization
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }
