from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import SessionLocal
from dependencies import get_db, get_current_user
from models.user import User
from schemas.auth import LoginRequest, Token, UserProfile, ForgotPasswordRequest, ResetPasswordRequest
from services.auth_service import verify_password, create_access_token, get_password_hash
from config import settings
from jose import JWTError, jwt
from datetime import datetime, timedelta
import secrets

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    # Check if account is locked
    if user.locked_until and user.locked_until > datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account locked due to too many failed attempts. Try again later."
        )
        
    if not verify_password(request.password, user.password_hash):
        # Handle failed attempt
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= 5:
            user.locked_until = datetime.utcnow() + timedelta(minutes=15)
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Successful login: reset lockout counters
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        token = secrets.token_urlsafe(32)
        user.reset_password_token = token
        user.reset_password_expires = datetime.utcnow() + timedelta(hours=1)
        db.commit()
        
        # In a real app, send an email. For this MVP, print to console.
        print(f"==================================================")
        print(f"PASSWORD RESET TOKEN FOR {user.email}:")
        print(f"{token}")
        print(f"==================================================")
        
    # Always return success to prevent email enumeration
    return {"message": "If that email exists in our system, a password reset token has been generated."}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_password_token == request.token).first()
    
    if not user or not user.reset_password_expires or user.reset_password_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
        
    user.password_hash = get_password_hash(request.new_password)
    user.reset_password_token = None
    user.reset_password_expires = None
    # Also unlock account if they reset password
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    
    return {"message": "Password reset successfully"}

@router.get("/me", response_model=UserProfile)
def read_users_me(current_user: User = Depends(get_current_user)):
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role.name if current_user.role else "unknown"
    )
