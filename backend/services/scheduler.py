import asyncio
import logging
from datetime import datetime, timedelta
from database import SessionLocal
from models.driver import Driver

logger = logging.getLogger(__name__)

async def check_expiring_licenses():
    """
    Background job that runs periodically to check for driver licenses
    expiring within the next 30 days and 'sends' an email alert.
    """
    logger.info("Scheduler started: Checking for expiring driver licenses...")
    
    while True:
        db = SessionLocal()
        try:
            today = datetime.utcnow()
            thirty_days_from_now = today + timedelta(days=30)
            
            expiring_drivers = db.query(Driver).filter(
                Driver.license_expiry <= thirty_days_from_now,
                Driver.license_expiry >= today
            ).all()
            
            for driver in expiring_drivers:
                # Simulating an email send for the hackathon
                days_left = (driver.license_expiry - today.date()).days
                print(f"[EMAIL ALERT] IMPORTANT: Driver {driver.name}'s license ({driver.license_number}) expires in {days_left} days! (on {driver.license_expiry.strftime('%Y-%m-%d')})")
                
            expired_drivers = db.query(Driver).filter(Driver.license_expiry < today).all()
            for driver in expired_drivers:
                print(f"[EMAIL ALERT] URGENT: Driver {driver.name}'s license is EXPIRED!")
                
        except Exception as e:
            logger.error(f"Error in scheduler: {e}")
        finally:
            db.close()
            
        # Run once a day in production, but for testing/hackathon we can sleep 60 seconds.
        # We will sleep 24 hours to be realistic, but the first run happens immediately on startup.
        await asyncio.sleep(86400) 
