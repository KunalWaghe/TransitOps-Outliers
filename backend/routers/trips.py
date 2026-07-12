from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from dependencies import get_current_user
from schemas.trip import TripCreate, TripComplete, TripResponse
from services import trip_service
from models.user import User

router = APIRouter(
    prefix="/api/trips",
    tags=["trips"],
    responses={404: {"description": "Not found"}},
)

def require_dispatcher(current_user: User = Depends(get_current_user)):
    if current_user.role.name != "dispatcher":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/", response_model=List[TripResponse])
def read_trips(
    skip: int = 0, 
    limit: int = 20, 
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return trip_service.get_trips(db, skip=skip, limit=limit, status=status)

@router.get("/{trip_id}", response_model=TripResponse)
def read_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_trip = trip_service.get_trip(db, trip_id=trip_id)
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    return db_trip

@router.post("/", response_model=TripResponse)
def create_trip(trip: TripCreate, db: Session = Depends(get_db), current_user: User = Depends(require_dispatcher)):
    return trip_service.create_trip(db=db, trip=trip)

@router.post("/{trip_id}/dispatch", response_model=TripResponse)
def dispatch_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_dispatcher)):
    return trip_service.dispatch_trip(db=db, trip_id=trip_id)

@router.post("/{trip_id}/complete", response_model=TripResponse)
def complete_trip(trip_id: int, complete_data: TripComplete, db: Session = Depends(get_db), current_user: User = Depends(require_dispatcher)):
    return trip_service.complete_trip(db=db, trip_id=trip_id, complete_data=complete_data)

@router.post("/{trip_id}/cancel", response_model=TripResponse)
def cancel_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_dispatcher)):
    return trip_service.cancel_trip(db=db, trip_id=trip_id)
