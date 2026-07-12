from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class AppSetting(Base):
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True)
    depot_name = Column(String, default="Main Depot")
    currency = Column(String, default="USD")
    distance_unit = Column(String, default="Kilometers")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
