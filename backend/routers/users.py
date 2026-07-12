from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
from dependencies import get_db, get_current_user
from models.user import User
from schemas.user import UserCreate, UserUpdate, UserResponse
from services.auth_service import get_password_hash
from email_validator import validate_email, EmailNotValidError

router = APIRouter(prefix="/api/users", tags=["users"])

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role.name != "fleet_manager":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

def validate_and_normalize_email(email: str) -> str:
    try:
        emailinfo = validate_email(email, check_deliverability=False)
        return emailinfo.normalized
    except EmailNotValidError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return db.query(User).all()

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    email = validate_and_normalize_email(user_in.email)
    
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user = User(
        email=email,
        name=user_in.name,
        password_hash=get_password_hash(user_in.password),
        role_id=user_in.role_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.put("/me", response_model=UserResponse)
def update_user_me(user_in: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if user_in.email:
        email = validate_and_normalize_email(user_in.email)
        # Check if email is taken by someone else
        existing = db.query(User).filter(User.email == email).first()
        if existing and existing.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = email
        
    if user_in.name:
        current_user.name = user_in.name
        
    if user_in.password:
        current_user.password_hash = get_password_hash(user_in.password)
        
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_in: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user_in.email:
        email = validate_and_normalize_email(user_in.email)
        existing = db.query(User).filter(User.email == email).first()
        if existing and existing.id != user.id:
            raise HTTPException(status_code=400, detail="Email already registered")
        user.email = email
        
    if user_in.name:
        user.name = user_in.name
    if user_in.password:
        user.password_hash = get_password_hash(user_in.password)
    if user_in.role_id:
        user.role_id = user_in.role_id
        
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
        
    db.delete(user)
    db.commit()
    return None
