import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

# Secret key, algorithm, and access token expiration time loaded from environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "ZLgwvB2x28VpadY6MErD7xYI4FtKJmV557RUFLUrzlk=")  # Add default in case not found
ALGORITHM = os.getenv("ALGORITHM", "HS256")  # Default algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))  # Default expiration time of 30 minutes

# OAuth2 Password Bearer token (used to extract token from Authorization header)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Function to create access token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print(f"Encoded JWT: {encoded_jwt}")  # Log the encoded token
    return encoded_jwt

# Function to verify token and get current user
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        print(f"Received Token: {token}")  # Log the received token
        
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        print(f"Decoded Token: {payload}")  # Log the decoded payload

        # Extract user details from the payload
        user_id: str = payload.get("id")
        username: str = payload.get("username")
        role: str = payload.get("role")
        
        # If any required field is missing, raise the credentials_exception
        if user_id is None or username is None or role is None:
            raise credentials_exception
        
        return {"id": user_id, "username": username, "role": role}
    
    except JWTError as e:
        print(f"JWT Error: {e}")  # Log the error
        raise credentials_exception

# Exception to raise when credentials are invalid
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)
