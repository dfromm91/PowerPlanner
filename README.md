# PowerPlanner Project

PowerPlanner is a project designed to make logging your workouts more efficient and seamless. With this application, you can manage your workout plans, track your progress, and visualize your progress.

## Features
- Log and manage workouts with a user-friendly interface.
- Authentication using JSON Web Tokens (JWT).
- Preconfigured SQLite database for easy setup.
- Email notifications for transactional events using Brevo (via Nodemailer).
- Modern React-based frontend for a responsive and interactive experience.
- Node.js and Express backend for robust API support.

## Tech Stack
- **Visualization**: Recharts for interactive charts
- **Backend**: Node.js, Express, Nodemailer
- **Frontend**: React, Vite
- **Database**: SQLite (file-based, preconfigured)
- **Authentication**: JSON Web Tokens (JWT)

## Getting Started

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (with npm)
- A modern web browser

### Installation Steps

1. Clone the repository to your local machine:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Navigate to the `frontend` folder and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Navigate to the `backend` folder and install dependencies:
   ```bash
   cd ../backend
   npm install
   ```

### Setting Environment Variables

Before running the project, set up the following environment variables:

#### Backend (`backend` folder):
Create a `.env` file in the `backend` directory and add:
```env
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
EMAIL_SENDER=your_email_sender_address
JWT_SECRET=your_jwt_secret
```

#### Frontend (`frontend` folder):
Create a `.env` file in the `frontend` directory and add:
```env
VITE_BACKEND_API=http://localhost:3000
```
Replace `http://localhost:3000` with your backend's URL if it is different.

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   node server.js
   ```

2. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

### Test User

Once the application is running, you can use the test user credentials displayed on the landing page to log in and explore the app.

## Notes
- Ensure your environment variables are correctly set up before running the application.
- Both the backend and frontend servers need to be running simultaneously for full functionality.
