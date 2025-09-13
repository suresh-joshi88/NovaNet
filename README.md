NovaNet is a backend service that unifies astrophysical event data from multiple observatories — such as gravitational waves, optical flashes, and gamma-ray bursts. It ingests event data, standardizes it, and applies a correlation engine to detect linked cosmic events based on temporal (±1 day) and spatial (≤1° RA/DEC) proximity.

The system exposes clean REST APIs so researchers and frontend dashboards can visualize, explore, and analyze hidden cosmic connections.

## 🚀 Features

1. Data Ingestion: Upload astrophysical events via CSV or JSON.
2. Correlation Engine: Detect event clusters based on time and coordinates.
3. REST APIs: Simple endpoints for uploading, fetching, and correlating events.
4. MongoDB Integration: Stores events and correlated results.
5. Extensible Design: Future support for live APIs (GWOSC, ZTF, NASA HEASARC) and ML-based scoring.

## 🛠️ Tech Stack

Node.js + Express – REST API framework
MongoDB + Mongoose – Database for storing event data
Multer + CSV Parser – File upload & parsing
Custom Utils – Spatio-temporal correlation logic

## 📂 Project Structure

backend/
├── server.js                 # Entry point
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   └── Event.js              # Event schema
├── controllers/
│   └── eventController.js    # Business logic
├── routes/
│   └── eventRoutes.js        # API endpoints
├── utils/
│   └── correlation.js        # Correlation logic
├── uploads/                  # Uploaded CSV files (optional)
├── package.json
└── README.md

## ⚙️ Setup & Installation

Clone repo:

git clone https://github.com/YOUR-USERNAME/novanet-backend.git
cd novanet-backend


Install dependencies:
npm install


Create .env file:
MONGO_URI=your-mongodb-uri
PORT=5000


Run the server:
npm run dev
(uses nodemon for hot reload)

📡 API Endpoints
Upload Events

POST /events/upload
Upload astrophysical event data (CSV/JSON).

Fetch All Events
GET /events
Retrieve all stored events.

Correlate Events
GET /events/correlate
Run correlation engine → return clusters of linked events.

## 🌠 Roadmap

 Upload mock event data
 Correlation engine (time + RA/DEC matching)
 REST APIs for ingestion and correlation
 API integration (GWOSC, ZTF, NASA HEASARC)
 ML-based confidence scoring
 Advanced visualization support

## 👨‍🚀 Team

Prince Kumar Singh – Backend Developer
Collaborators ( Suresh Joshi & Tanishq Khandelwal ) – Frontend & Dashboard Development

📜 License
MIT License – free to use, modify, and distribute.