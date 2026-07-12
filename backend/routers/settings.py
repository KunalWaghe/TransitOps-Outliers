from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from models.user import User
from models.setting import AppSetting
from schemas.setting import AppSettingUpdate, AppSettingResponse

router = APIRouter(
    prefix="/api/settings",
    tags=["settings"]
)

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role.name != "fleet_manager":
        raise HTTPException(status_code=403, detail="Not authorized. Admin role required.")
    return current_user

@router.get("", response_model=AppSettingResponse)
def get_settings(db: Session = Depends(get_db)):
    setting = db.query(AppSetting).first()
    if not setting:
        setting = AppSetting()
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting

@router.put("", response_model=AppSettingResponse)
def update_settings(settings_update: AppSettingUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    setting = db.query(AppSetting).first()
    if not setting:
        setting = AppSetting()
        db.add(setting)
        
    if settings_update.depot_name is not None:
        setting.depot_name = settings_update.depot_name
    if settings_update.currency is not None:
        setting.currency = settings_update.currency
    if settings_update.distance_unit is not None:
        setting.distance_unit = settings_update.distance_unit
        
    db.commit()
    db.refresh(setting)
    return setting
