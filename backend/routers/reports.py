import csv
import io
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from models.user import User
from models.trip import Trip

router = APIRouter(
    prefix="/api/reports",
    tags=["reports"]
)

def require_financial_analyst(current_user: User = Depends(get_current_user)):
    if current_user.role.name != "financial_analyst":
        raise HTTPException(status_code=403, detail="Not authorized. Financial analyst role required.")
    return current_user

@router.get("/export/csv")
def export_trips_csv(db: Session = Depends(get_db), current_user: User = Depends(require_financial_analyst)):
    trips = db.query(Trip).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow([
        "Trip ID", "Source", "Destination", "Vehicle ID", "Driver ID",
        "Status", "Planned Distance (km)", "Actual Distance (km)",
        "Cargo Weight (kg)", "Fuel Consumed (L)", "Revenue", "Created At"
    ])
    
    for trip in trips:
        writer.writerow([
            trip.id,
            trip.source,
            trip.destination,
            trip.vehicle_id,
            trip.driver_id,
            trip.status,
            trip.planned_distance_km,
            trip.actual_distance_km,
            trip.cargo_weight_kg,
            trip.fuel_consumed_liters,
            trip.revenue,
            trip.created_at.strftime("%Y-%m-%d %H:%M:%S") if trip.created_at else ""
        ])
        
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=trips_report.csv"}
    )
