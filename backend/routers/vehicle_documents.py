from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from dependencies import get_db
from dependencies import get_current_user
from models.user import User
from schemas.vehicle_document import VehicleDocumentResponse
from services import vehicle_document_service

router = APIRouter(
    prefix="/api/vehicles/{vehicle_id}/documents",
    tags=["vehicle-documents"],
    responses={404: {"description": "Not found"}},
)

@router.get("", response_model=List[VehicleDocumentResponse])
def get_documents(
    vehicle_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return vehicle_document_service.get_vehicle_documents(db, vehicle_id)

@router.post("", response_model=VehicleDocumentResponse)
def upload_document(
    vehicle_id: int,
    file: UploadFile = File(...),
    name: str = Form(...),
    type: str = Form(...),
    expiry_date: Optional[datetime] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return vehicle_document_service.upload_vehicle_document(
        db=db,
        vehicle_id=vehicle_id,
        file=file,
        name=name,
        doc_type=type,
        expiry_date=expiry_date
    )
