# 💧 Water Source Mapping & Quality Reporting System

**Student:** Shawn William Wafula | **Reg No:** BSCLMR149823
**Supervisor:** Samuel Karuga | **Institution:** St. Paul's University | **July 2025**

---

## Tech Stack

| Layer      | Technology            |
|------------|-----------------------|
| Frontend   | React + Next.js 14    |
| Backend    | Node.js + Express     |
| Database   | PostgreSQL            |
| Maps       | Leaflet.js            |

---

## Project Structure

```
water-system/
├── frontend/    # Next.js + React app
├── backend/     # Node.js + Express API
└── database/    # PostgreSQL schema, migrations, seed data
```

---

## Setup Instructions

### 1. Database (PostgreSQL)

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE water_system_db;"

# Run the schema (creates all 6 tables)
psql -U postgres -d water_system_db -f database/schema.sql

# (Optional) Seed with sample data
psql -U postgres -d water_system_db -f database/seed.sql
```

Or run migrations one by one in order:
```bash
psql -U postgres -d water_system_db -f database/migrations/001_create_users.sql
psql -U postgres -d water_system_db -f database/migrations/002_create_water_sources.sql
psql -U postgres -d water_system_db -f database/migrations/003_create_sensor_readings.sql
psql -U postgres -d water_system_db -f database/migrations/004_create_reports.sql
psql -U postgres -d water_system_db -f database/migrations/005_create_notifications.sql
psql -U postgres -d water_system_db -f database/migrations/006_create_alerts.sql
```

---

### 2. Backend (Node.js + Express)

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env and set your PostgreSQL credentials and JWT secret:
#   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
#   JWT_SECRET

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

#### API Base URL: `http://localhost:5000/api`

| Route                              | Access              |
|------------------------------------|---------------------|
| POST `/api/auth/register`          | Public              |
| POST `/api/auth/login`             | Public              |
| GET  `/api/auth/me`                | Authenticated       |
| GET  `/api/water-sources`          | Public              |
| POST `/api/water-sources`          | Admin/Field Officer |
| POST `/api/sensor-readings`        | Admin/Field Officer |
| GET  `/api/sensor-readings/source/:id` | Public          |
| POST `/api/reports`                | Authenticated       |
| GET  `/api/reports`                | Admin/Field Officer |
| GET  `/api/alerts`                 | Admin/Field Officer |
| GET  `/api/notifications`          | Authenticated       |

---

### 3. Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Edit .env.local:
#   NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start development server
npm run dev
# App runs on http://localhost:3000
```

---

## Seed Data Credentials

All seed users have password: `Password123`

| Email                              | Role          |
|------------------------------------|---------------|
| admin@watersystem.com              | Admin         |
| samuel.karuga@watersystem.com      | Field Officer |
| jane.mwangi@watersystem.com        | Field Officer |
| shawn.wafula@watersystem.com       | Public        |
| mary.achieng@watersystem.com       | Public        |
| peter.otieno@watersystem.com       | Public        |

---

## User Roles

| Role          | Permissions                                                    |
|---------------|----------------------------------------------------------------|
| Public        | View map, submit reports, receive notifications                |
| Field Officer | + Ingest sensor data, verify/dismiss reports, view dashboard   |
| Admin         | + Full user management, delete records, admin panel            |

---

## Key Features

- **GIS Map** — Interactive Leaflet map with colour-coded water source markers (green=safe, red=unsafe, yellow=unknown)
- **Sensor Ingestion** — POST sensor readings; alert engine auto-checks all 6 parameters against WHO thresholds
- **Alert Engine** — Triggers severity-ranked alerts (low/medium/high) and auto-updates source status to unsafe on high severity
- **Community Reports** — GPS-tagged reports with verify/dismiss workflow for field officers
- **Notifications** — Automatic notifications to all admin and field officer users when alerts trigger
- **Role-Based Access** — JWT + middleware enforces access at every route

---

## SDG Alignment

This system directly contributes to **Sustainable Development Goal 6** — Clean Water and Sanitation for All — by enabling real-time monitoring, community participation, and evidence-based water governance.
