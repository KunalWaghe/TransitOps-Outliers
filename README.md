# TransitOps

*Odoo Hackathon 2026 — Virtual Round*  
*Team:* The Outliers

## Team Members
- Kunal Waghe
- Sourabh Chouhan
- Yash Goyal

## Overview
A centralized web platform for logistics companies to manage their transport fleet, replacing messy spreadsheets with a smart, automated system. 

TransitOps provides a complete suite to track vehicles, drivers, dispatch workflows, maintenance logs, and financial expenses with role-based access control and real-time dashboard analytics.

## Live Demo
- **Frontend App**: [https://transitops-outliers-site.onrender.com/](https://transitops-outliers-site.onrender.com/)
- **Backend API**: [https://transitops-outliers-cqcn.onrender.com/](https://transitops-outliers-cqcn.onrender.com/)

## Features
- **Vehicle & Driver Management**: Track vehicle capacities, odometers, driver licenses, and safety scores.
- **Trip Lifecycle**: Dispatch workflows from Draft to Dispatched to Completed/Cancelled, with automatic resource allocation (vehicles and drivers are locked during trips).
- **Maintenance Tracking**: Log repairs and routine maintenance. Vehicles in the shop are automatically removed from the dispatch pool.
- **Fuel & Expense Logging**: Track tolls, fuel usage, and maintenance costs per vehicle.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Fleet Managers, Dispatchers, Safety Officers, and Financial Analysts.
- **Dashboard & KPIs**: Real-time insights into fleet utilization, active trips, and operational costs.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Recharts (for analytics).
- **Backend**: FastAPI, SQLAlchemy 2.0 (ORM), Alembic (Migrations), Pydantic.
- **Database**: PostgreSQL 15.
- **Authentication**: JWT-based stateless authentication.

## Demo Accounts
Once the database is seeded, you can log in with the following demo accounts (Password for all: `password123`):
- `admin@transitops.com` (Fleet Manager)
- `dispatch@transitops.com` (Dispatcher)
- `safety@transitops.com` (Safety Officer)
- `finance@transitops.com` (Financial Analyst)
