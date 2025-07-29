
# About
Web application for health declarations with COVID-19 screening.

## How to Run

### Backend
```bash
cd backend
npm install
npm start
```
Backend runs on: `http://localhost:3001`

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

## API Endpoints
- `GET /api/health-declarations` - Get all declarations
- `POST /api/health-declarations` - Submit new declaration
- `DELETE /api/health-declarations/:id` - Delete declaration

## Features
- Health declaration form with name, temperature, symptoms, COVID contact
- Display submitted records in table
- Delete records functionality

## Project Structure
```
health-declarations/
├── backend/
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html (html mount)
│   ├── src/
│   │   ├── App.css
│   │   ├── App.js
│   │   └── index.js (react entry)
│   └── package.json
└── README.md
```