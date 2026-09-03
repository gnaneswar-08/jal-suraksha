Jal Suraksha

Jal Suraksha is a smart flood and emergency response web application designed to connect citizens with emergency officers during flood and disaster situations.

Features

Citizen Portal

Emergency SOS reporting

Flood/hazard reporting

Current risk information

Incident information

Evacuation center information

Map-based evacuation support

Officer Portal

Emergency dashboard

Incident monitoring

Citizen report monitoring

Sensor telemetry

Risk monitoring

Emergency response controls

Register evacuation centers

Display evacuation centers on the map

Delete evacuation centers

Publish evacuation-center information to citizens

Login Portal

The home page provides separate entry points for:

Citizen Portal

Emergency Officer Portal

Technology Stack

Frontend: HTML, CSS, JavaScript

Backend: Python Flask

Maps: Leaflet / OpenStreetMap

Storage: Flask in-memory storage in the current prototype

Project Structure

Jal-Suraksha/
├── backend/
│   └── app.py
├── frontend/
│   ├── index.html
│   ├── citizen.html
│   ├── officer.html
│   ├── css/
│   │   └── ...
│   └── js/
│       ├── citizen.js
│       └── officer.js
└── README.md

Requirements

Python 3.9 or later and Flask.

Install Flask:

pip install flask

Run the Project

From the backend directory, run:

python app.py

Then open:

http://127.0.0.1:5000/

Main Routes

Route

Purpose

/

Login / entry page

/citizen

Citizen Portal

/officer

Officer Portal

/api/dashboard

Dashboard data

/api/risk

Risk information

/api/incidents

Incident information

/api/sensors

Sensor information

/api/shelter

Shelter information

/api/evacuation-centers

Get/register evacuation centers

/api/evacuation-centers/<id>

Delete evacuation center

/api/citizen-report

Submit hazard report

/api/sos

Submit emergency SOS

/api/citizen-reports

Get citizen reports

/api/citizen-current-incident

Get latest citizen incident

/api/health

Server health check

Evacuation Center Workflow

Officer registers center
        ↓
Flask API
        ↓
Evacuation center data
        ↓
 ┌──────┴──────┐
 ↓             ↓
Officer Map   Citizen Portal

An evacuation center contains:

Name

Location

Capacity

Latitude

Longitude

Occupancy/status information

Officers can add and delete centers. Registered centers can be retrieved by the Citizen Portal.

Data Storage

The current prototype uses Python in-memory lists:

citizen_reports = []
evacuation_centers = []

This is suitable for a hackathon demonstration, but the data is lost when the Flask server restarts.

For production, the project should use a persistent database such as SQLite or PostgreSQL.

Map and GPS

The application uses Leaflet and OpenStreetMap for map visualization.

Browser geolocation can be used where GPS access is required. The browser must be given location permission.

Security Note

The current login page is intended for the hackathon prototype. A production deployment should add secure authentication, authorization, sessions, password/OTP handling, and role-based access control.

Future Improvements

SQLite/PostgreSQL persistent storage

Secure authentication

Real-time WebSocket updates

Real IoT sensor integration

Road-based evacuation routing

SMS/push emergency alerts

Officer dispatch tracking

Cloud deployment

Audit logs

Offline/mesh-network emergency communication

Project Objective

Jal Suraksha connects citizens and emergency officers through a common disaster-response platform.

Citizens can report danger, request emergency assistance, and locate safe evacuation centers.

Officers can monitor incidents, assess risk, manage emergency response, and publish evacuation centers to citizens.

Development Status

Project: Jal Suraksha
Type: Smart Flood & Disaster Response Web Application
Status: Hackathon Prototype
