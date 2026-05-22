# Halo Events Connecticut - Bookings App

Halo Events Connecticut Bookings App is a full-stack event decor booking application. The app allows clients to view available event decor packages, submit booking requests, and allows an admin user to log in and manage those requests through an admin dashboard.

This project was built as a final full-stack application project to demonstrate frontend development, backend API design, database integration, API communication, deployment, and Git version control.

## Live Application

Frontend: https://bookings-app-xi.vercel.app/
Backend API: https://bookings-app-backend.onrender.com

## Features

### Client View

- Home page with event decor business branding
- Packages page with available decor package options
- Booking request form
- Form validation for required fields
- Booking data submitted to the backend and saved in the database

### Admin View

- Admin login page
- Protected admin dashboard view
- View all submitted booking requests
- See client details, event date, location, package, and notes
- Update booking status:
  - Pending
  - Approved
  - Completed
  - Cancelled
- Logout functionality

## Technologies Used

### Frontend

- React
- Vite
- Axios
- Custom CSS
- Google Fonts: Playfair Display

### Backend

- Node.js
- Express.js
- PostgreSQL
- pg
- dotenv
- cors

### Database

- Supabase PostgreSQL

### Deployment

- Render for backend deployment
- Vercel for frontend deployment

## Project Structure

```text
bookings-app
├── backend
│   ├── db.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md