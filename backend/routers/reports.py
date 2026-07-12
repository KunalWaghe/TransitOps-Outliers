import csv
import io
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from dependencies import get_db
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

@router.get("/export/pdf")
def export_trips_pdf(db: Session = Depends(get_db), current_user: User = Depends(require_financial_analyst)):
    trips = db.query(Trip).all()
    
    output = io.BytesIO()
    doc = SimpleDocTemplate(output, pagesize=landscape(letter))
    elements = []
    
    styles = getSampleStyleSheet()
    elements.append(Paragraph("TransitOps Trips Report", styles['Title']))
    
    data = [[
        "Trip ID", "Source", "Destination", "Vehicle ID", "Driver ID",
        "Status", "Planned (km)", "Actual (km)",
        "Cargo (kg)", "Fuel (L)", "Revenue"
    ]]
    
    for trip in trips:
        data.append([
            str(trip.id),
            str(trip.source),
            str(trip.destination),
            str(trip.vehicle_id),
            str(trip.driver_id),
            str(trip.status),
            str(trip.planned_distance_km),
            str(trip.actual_distance_km if trip.actual_distance_km is not None else ""),
            str(trip.cargo_weight_kg),
            str(trip.fuel_consumed_liters if trip.fuel_consumed_liters is not None else ""),
            str(trip.revenue if trip.revenue is not None else "")
        ])
        
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(table)
    doc.build(elements)
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=trips_report.pdf"}
    )
