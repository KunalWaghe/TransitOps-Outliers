import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from models.user import Role, User
from services.auth_service import get_password_hash

def seed_db():
    db = SessionLocal()
    
    # 1. Create roles
    roles_data = ["fleet_manager", "dispatcher", "safety_officer", "financial_analyst"]
    roles = {}
    for role_name in roles_data:
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            role = Role(name=role_name, description=f"{role_name.replace('_', ' ').title()}")
            db.add(role)
            db.commit()
            db.refresh(role)
        roles[role_name] = role

    # 2. Create demo users
    users_data = [
        {"email": "admin@transitops.com", "name": "Admin Fleet", "role": "fleet_manager"},
        {"email": "dispatch@transitops.com", "name": "Dispatcher Dan", "role": "dispatcher"},
        {"email": "safety@transitops.com", "name": "Safety Sam", "role": "safety_officer"},
        {"email": "finance@transitops.com", "name": "Finance Fiona", "role": "financial_analyst"},
    ]

    for ud in users_data:
        user = db.query(User).filter(User.email == ud["email"]).first()
        if not user:
            user = User(
                email=ud["email"],
                name=ud["name"],
                password_hash=get_password_hash("password123"),
                role_id=roles[ud["role"]].id
            )
            db.add(user)
    
    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
