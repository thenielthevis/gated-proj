from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from .models import User, UserInDB
from .services import create_user, get_user_by_username

# Initialize password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic model for login data
class LoginData(BaseModel):
    username: str
    password: str

# Router for user registration and login
user_router = APIRouter()

@user_router.post("/register")
async def register(user: User):
    # Hash the password before storing it
    hashed_password = pwd_context.hash(user.password)
    
    # Create a UserInDB object with the hashed password
    user_in_db = UserInDB(username=user.username, password=hashed_password, role=user.role)
    
    # Check if user already exists
    if get_user_by_username(user.username):
        raise HTTPException(status_code=400, detail="Username already registered.")
    
    # Create the user in DB
    user_id = create_user(user_in_db)
    return {"message": "User created successfully", "user_id": user_id}

@user_router.post("/login")
async def login(login_data: LoginData):
    user_data = get_user_by_username(login_data.username)
    
    if user_data is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify the password using bcrypt
    if not pwd_context.verify(login_data.password, user_data['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Here you would return a token (JWT) in a real implementation
    return {"message": "Login successful", "role": user_data['role']}
