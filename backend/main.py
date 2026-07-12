import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, fuel_logs, expenses, dashboard, vehicles, drivers, trips, maintenance, reports, vehicle_documents, users
from services.scheduler import check_expiring_licenses

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(check_expiring_licenses())
    yield
    task.cancel()

app = FastAPI(title="TransitOps API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(drivers.router)
app.include_router(fuel_logs.router)
app.include_router(expenses.router)
app.include_router(dashboard.router)
app.include_router(trips.router)
app.include_router(maintenance.router)
app.include_router(reports.router)
app.include_router(vehicle_documents.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to TransitOps API"}
