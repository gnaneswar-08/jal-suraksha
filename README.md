🌊 Jal Suraksha

Smart Flood & Disaster Response System

Jal Suraksha is a web-based emergency response platform that connects citizens and emergency officers during flood and disaster situations.

Citizens can report emergencies and find evacuation centers, while officers can monitor incidents, assess risk, and manage evacuation centers through a centralized dashboard.

✨ Features

👤 Citizen Portal

🚨 Emergency SOS

📍 Hazard and flood reporting

⚠️ Risk information

🏠 Evacuation center information

🗺️ Map-based evacuation support

🛡️ Officer Portal

📊 Emergency command dashboard

🚨 Citizen incident monitoring

📡 Sensor monitoring

⚠️ Risk assessment

🏠 Register evacuation centers

🗺️ Display evacuation centers on the map

🗑️ Delete evacuation centers

🚑 Emergency response controls

🔐 Access Portal

The application provides separate entry points for:

Citizen → Citizen Safety Portal

Officer → Emergency Command Portal

🏗️ System Architecture

                    JAL SURAKSHA
                         │
                  ┌──────┴──────┐
                  │             │
              CITIZEN        OFFICER
               PORTAL         PORTAL
                  │             │
                  └──────┬──────┘
                         │
                    FLASK BACKEND
                         │
              ┌──────────┼──────────┐
              │          │          │
          INCIDENTS     SOS     EVACUATION
                                   CENTERS
                                      │
                         ┌────────────┘
                         │
                        MAP

🛠️ Tech Stack

Technology

Usage

HTML

Frontend structure

CSS

UI and styling

JavaScript

Frontend functionality

Python

Backend

Flask

REST API and server

Leaflet

Interactive maps

OpenStreetMap

Map tiles

📂 Project Structure

Jal-Suraksha/
│
├── backend/
│   └── app.py
│
├── frontend/
│   ├── index.html
│   ├── citizen.html
│   ├── officer.html
│   │
│   ├── css/
│   │   └── ...
│   │
│   └── js/
│       ├── citizen.js
│       └── officer.js
│
└── README.md

🚀 Getting Started

1. Clone the repository

git clone <your-repository-url>
cd Jal-Suraksha

2. Install Flask

pip install flask

3. Start the server

python app.py

4. Open the application

http://127.0.0.1:5000/

🔄 How It Works

Emergency Reporting

Citizen
   ↓
SOS / Hazard Report
   ↓
Flask Backend
   ↓
Officer Dashboard
   ↓
Emergency Response

Evacuation Centers

Officer
   ↓
Register Evacuation Center
   ↓
Flask Backend
   ↓
Citizen Portal
   ↓
Center displayed on Map

🏠 Evacuation Center Management

Officers can register a safe evacuation center using:

Center name

Location

Capacity

Latitude

Longitude

Registered centers are made available to the Citizen Portal and can be displayed on the map.

💾 Data Storage

The current hackathon prototype uses in-memory storage for rapid development and demonstration.

citizen_reports = []
evacuation_centers = []

Data resets when the Flask server restarts.

A future version can use SQLite or PostgreSQL for persistent storage.

🔮 Future Scope

Persistent database

Secure authentication and role-based access

Real-time WebSocket communication

IoT flood sensors

SMS and push emergency alerts

Advanced road-based evacuation routing

Cloud deployment

Offline emergency communication

AI-based flood risk prediction

🎯 Project Goal

Detect. Respond. Protect.

Jal Suraksha aims to reduce emergency response time by creating a common platform where citizens can request help and find safety, while officers can monitor situations and coordinate response.

👥 Team

Jal Suraksha — Hackathon Project

📌 Project Status

Hackathon Prototype

Built to demonstrate an integrated citizen and emergency-response workflow for flood and disaster management.
