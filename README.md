# Final Project – Explore Ames

## 📚 Table of Contents
- Introduction
- Project Description
- File Structure
- Code & Logic
- Setup
- Contributions
- API Setup

---

## 🧭 Introduction

Explore Ames is a full-stack web application designed to showcase the city of Ames, Iowa, in an interactive and user-friendly way. The purpose of this project is to provide visitors, new residents, and locals with a centralized platform to explore dining options, attractions, and city highlights.

The primary users of this application are tourists and residents who want to discover what Ames has to offer. Secondary users include administrators who manage content through the admin interface.

This project is original but inspired by common city tourism and discovery websites. It was built from scratch using modern web technologies as part of COM S 3190.

---

## 🧩 Project Description

Explore Ames provides users with a smooth navigation experience through multiple sections of the site:

- Home Page: Central navigation hub for all features
- Diners Page: Displays local restaurants with details and ratings
- Explore Us Page: Highlights attractions and popular locations
- Shop Page: Preview of Ames-themed merchandise
- Authentication: Login and signup functionality
- Admin Page: Allows management of application data

The application supports CRUD operations for diners and attractions. Users can read data dynamically from the database, while admin-level users can create, update, and delete entries.

---

## 🗂️ Project Structure
```text
Explore-Ames/
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages (Home, Diners, etc.)
│   │   ├── assets/          # Images, styles, static files
│   │   ├── services/        # API calls (Axios)
│   │   └── App.js           # Root React component
│   └── package.json
│
├── backend/
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   ├── models/              # MongoDB schemas
│   ├── config/              # DB and environment config
│   └── server.js            # Entry point
│
├── Documents/
│   ├── Final Report
│   ├── Proposal
│   └── README
│
└── README.md
```
---

## 🧠 Code & Logic

Frontend–Backend Communication:  
The frontend communicates with the backend using Axios to send HTTP requests to RESTful API endpoints. Data is exchanged in JSON format and rendered dynamically using React state management.

Database Usage:  
MongoDB is used to store users, diners, and attractions. The backend handles all CRUD operations using MongoDB queries.

---

## ⚙️ Setup

Steps to run the app:

npm install

Add a .env file to the backend directory with required environment variables.

npm run dev

Ensure both frontend and backend servers are running.

---

## 👥 Contributions

Anish Reddy Nukala
- Signup functionality
- Admin page development
- Home page development
- Shop page implementation
- Styling, UX improvements, testing, and debugging
- Documentation writing and report organization

Prajwal Reddy Chenreddy
- Login functionality
- Diners and Explore Us modules
- Backend CRUD routes
- MongoDB schema design and database integration
- Styling, UX improvements, testing, and debugging
- Documentation writing and report organization

