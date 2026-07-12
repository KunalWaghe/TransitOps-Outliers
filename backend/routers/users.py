from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from dependencies import get_db, get_current_user
from models.user import User, Role
from schemas.auth import UserProfile, UserUpdate, UserCreate
from email_validator import validate_email, EmailNotValidError
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role.name != "fleet_manager":  # Using fleet_manager as admin for now
        raise HTTPException(status_code=403, detail="Not authorized. Admin role required.")
    return current_user

@router.get("", response_model=List[UserProfile])
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "name": u.name, "role": u.role.name if u.role else ""} for u in users]

@router.post("", response_model=UserProfile)
def create_user(user_create: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    try:
        validate_email(user_create.email, check_deliverability=True)
    except EmailNotValidError as e:
        raise HTTPException(status_code=400, detail=f"Invalid email: {str(e)}")
        
    if db.query(User).filter(User.email == user_create.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    role = db.query(Role).filter(Role.name == user_create.role).first()
    if not role:
        raise HTTPException(status_code=400, detail="Role not found")
        
    hashed_password = pwd_context.hash(user_create.password)
    new_user = User(
        email=user_create.email,
        name=user_create.name,
        password_hash=hashed_password,
        role_id=role.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "email": new_user.email, "name": new_user.name, "role": new_user.role.name if new_user.role else ""}

def _validate_and_update_user(db: Session, db_user: User, user_update: UserUpdate):
    if user_update.name:
        db_user.name = user_update.name
    if user_update.email:
        try:
            # Check MX records to ensure legitimacy
            validate_email(user_update.email, check_deliverability=True)
        except EmailNotValidError as e:
            raise HTTPException(status_code=400, detail=f"Invalid email: {str(e)}")
        
        # Check uniqueness
        if db.query(User).filter(User.email == user_update.email, User.id != db_user.id).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        db_user.email = user_update.email
    if user_update.role:
        role = db.query(Role).filter(Role.name == user_update.role).first()
        if not role:
            raise HTTPException(status_code=400, detail="Role not found")
        db_user.role_id = role.id
    
    db.commit()
    db.refresh(db_user)
    return {"id": db_user.id, "email": db_user.email, "name": db_user.name, "role": db_user.role.name if db_user.role else ""}

@router.put("/me", response_model=UserProfile)
def update_my_profile(user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Users cannot update their own role unless they are admin, but let's restrict role update for /me completely
    user_update.role = None 
    return _validate_and_update_user(db, current_user, user_update)

@router.put("/{user_id}", response_model=UserProfile)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return _validate_and_update_user(db, db_user, user_update)

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if db_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted successfully"}
