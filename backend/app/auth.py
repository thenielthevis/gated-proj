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
SECRET_KEY = os.getenv("SECRET_KEY", "ZLgwvB2x28VpadY6MErD7xYI4FtKJmV557RUFLUrzlk=")  # Default fallback key
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

    # Log token only in development or debug mode
    if os.getenv("DEBUG", "false").lower() == "true":
        print(f"Encoded JWT: {encoded_jwt}")
    return encoded_jwt

# Function to verify token and get current user
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Extract user details
        user_id: str = payload.get("id")
        username: str = payload.get("username")
        role: str = payload.get("role")
        
        # If any required field is missing, raise the credentials_exception
        if user_id is None or username is None or role is None:
            raise credentials_exception

        return {"id": user_id, "username": username, "role": role}

    except JWTError:
        raise credentials_exception
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

# Exception to raise when credentials are invalid
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

# Function to check for an admin user
def get_current_admin_user(token: str = Depends(oauth2_scheme)):
    user = get_current_user(token)
    if user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource"
        )
    return user