# Appointment Manager

A complete medical appointment management system built with Node.js and React.

## Live Demo

**Frontend:** https://appointment-manager-alpha.vercel.app/  
**Backend API:** https://appointment-manager-oenl.onrender.com

## Features

### Authentication & Authorization
- User registration and login with JWT
- Two user roles: Client and Professional
- Role-based route protection
- Persistent sessions with localStorage

### Appointment Management
- Create new appointments with available professionals
- View, edit, and delete existing appointments
- Status system: Pending, Accepted, Cancelled, Completed
- Filter by date and status

### Professional Dashboard
- Availability management (days and hours)
- Accept/Reject appointment requests
- Client list visualization
- Statistics dashboard

### User Interface
- Role-based personalized dashboard
- Responsive design (mobile-first)
- Profile photo upload
- Intuitive and smooth experience

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Multer (file upload)
- CORS middleware

### Frontend
- React
- React Router DOM
- CSS Modules + Bootstrap
- Fetch API

### Hosting
- Backend: Render
- Frontend: Vercel
- Database: Render PostgreSQL

## Local Installation

### Prerequisites
- Node.js v18 or higher
- PostgreSQL 14 or higher
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials