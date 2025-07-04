from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any
from bson import ObjectId
from datetime import datetime

from core.database import get_database
from models.user import User, UserRole

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/register")
async def register(
    user_data: dict,
    db=Depends(get_database)
):
    """
    Register a new user with just email and name.
    
    - **email**: Valid email address
    - **full_name**: User's full name
    """
    # Check if user already exists
    existing_user = db.users.find_one({"email": user_data["email"]})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create user with simple data
    user_doc = {
        "email": user_data["email"],
        "full_name": user_data["full_name"],
        "role": UserRole.USER,
        "created_at": datetime.utcnow(),
        "last_login": datetime.utcnow()
    }
    
    result = db.users.insert_one(user_doc)
    
    # Get created user
    created_user = db.users.find_one({"_id": result.inserted_id})
    created_user["id"] = str(created_user["_id"])
    del created_user["_id"]
    
    return {
        "user": created_user,
        "message": "User registered successfully"
    }

@router.post("/login")
async def login(
    credentials: dict,
    db=Depends(get_database)
):
    """
    Login with just email address.
    
    - **email**: Registered email address
    """
    # Find user by email
    user = db.users.find_one({"email": credentials["email"]})
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Email not found. Please register first."
        )
    
    # Update last login
    db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Format user response
    user["id"] = str(user["_id"])
    del user["_id"]
    
    return {
        "user": user,
        "message": "Login successful"
    }

@router.get("/user/{email}")
async def get_user_by_email(
    email: str,
    db=Depends(get_database)
):
    """
    Get user information by email.
    """
    user = db.users.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Format user response
    user["id"] = str(user["_id"])
    del user["_id"]
    
    return user

@router.get("/users")
async def list_users(
    db=Depends(get_database)
):
    """
    Get all users (for admin purposes).
    """
    users = list(db.users.find())
    
    # Format users response
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
    
    return users

@router.put("/user/{email}")
async def update_user(
    email: str,
    update_data: dict,
    db=Depends(get_database)
):
    """
    Update user information.
    """
    user = db.users.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Update user
    update_data["updated_at"] = datetime.utcnow()
    result = db.users.update_one(
        {"email": email},
        {"$set": update_data}
    )
    
    # Get updated user
    updated_user = db.users.find_one({"email": email})
    updated_user["id"] = str(updated_user["_id"])
    del updated_user["_id"]
    
    return {
        "user": updated_user,
        "message": "User updated successfully"
    } 