from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal
from dependencies import get_db, get_current_user
from models.expense import Expense
from models.user import User
from schemas.expense import ExpenseCreate, ExpenseResponse

router = APIRouter(prefix="/api/expenses", tags=["expenses"])

@router.get("", response_model=List[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Expense).all()

@router.post("", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_expense = Expense(**expense.model_dump())
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense
