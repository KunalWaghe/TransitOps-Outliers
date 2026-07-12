from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class VehicleDocument(Base):
    __tablename__ = "vehicle_documents"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    type = Column(String, nullable=False)
    expiry_date = Column(DateTime, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="documents")
