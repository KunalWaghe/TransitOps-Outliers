import os
import shutil
import uuid
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from models.vehicle_document import VehicleDocument
from models.vehicle import Vehicle

UPLOAD_DIR = "uploads/documents"

def ensure_upload_dir():
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

def upload_vehicle_document(
    db: Session,
    vehicle_id: int,
    file: UploadFile,
    name: str,
    doc_type: str,
    expiry_date: Optional[datetime] = None
) -> VehicleDocument:
    # Verify vehicle exists
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    ensure_upload_dir()

    # Generate a safe, unique filename
    ext = os.path.splitext(file.filename)[1] if file.filename else ""
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not upload file")

    db_doc = VehicleDocument(
        vehicle_id=vehicle_id,
        name=name,
        type=doc_type,
        file_path=file_path,
        expiry_date=expiry_date
    )
    
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    return db_doc

def get_vehicle_documents(db: Session, vehicle_id: int):
    return db.query(VehicleDocument).filter(VehicleDocument.vehicle_id == vehicle_id).all()
