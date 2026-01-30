# Retail360 - Intelligent BI Dashboard

## Project Structure
- `frontend/`: React + Vite + TailwindCSS (Glassmorphism UI)
- `backend/`: Node.js + Express (API Gateway)
- `python_backend/`: Python + Flask + Scikit-Learn (ML Engine)

## Startup Instructions

### 1. Python ML Service
```bash
cd python_backend
pip install -r requirements.txt
python app.py
```
*Runs on port 5001*

### 2. Node Backend
```bash
cd backend
npm install
npm start
```
*Runs on port 5000*

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
*Runs on port 5173 (usually)*

## Features
- **Dashboard**: Real-time sales overview.
- **Customers**: K-Means clustering visualization of customer segments.
- **Forecast**: SARIMA sales forecasting vs historical data.
