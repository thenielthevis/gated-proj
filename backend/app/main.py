import uvicorn
from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
from uvicorn.config import Config
from passlib.context import CryptContext
from .models import User, UserInDB
from .services import create_user, get_user_by_username

app = FastAPI()

# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic model for login data
class LoginData(BaseModel):
    username: str
    password: str

# Router for user registration and login
user_router = APIRouter()

@user_router.post("/register")
async def register(user: User):
    # Hash the password before saving
    hashed_password = pwd_context.hash(user.password)
    user_in_db = UserInDB(**user.dict(), password=hashed_password)
    
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

    return {"message": "Login successful", "role": user_data['role']}

# Include the user router
app.include_router(user_router, prefix="/users")

# Root endpoint to test the server
@app.get("/")
async def root():
    return {"message": "Hello World"}

# To programmatically stop uvicorn
def stop_uvicorn():
    uvicorn.Server(Config(app="main:app")).handle_exit(None)

# To run the server, you can use:
# uvicorn main:app --reload
