# Doorstep Service

A platform for connecting users with local service providers.

## Features

- **Authentication**: Secure user authentication using JWT tokens to enable user registration, login, and access control.
- **Admin**: Reviews and approves businesses and job postings.
- **User**: Search and book services, post job contracts.
- **Business**: Accept bookings and job contracts. Schedule daily appointments.
- **Chat Feature**: Implemented simple text chat feature between user and business.
- **Rating and Review**: Users can provide feedback and ratings for services offered by businesses.

## Project Structure

The project consists of two main parts:
- **Frontend**: React application (client folder)
- **Backend**: Node.js + Express API (server folder)

## Technologies Used

- **Frontend**: React, Bootstrap, Material UI
- **Backend**: Node.js, Express
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)

## Environment Setup

### Backend (.env file in server directory)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/DoorstepserviceDB
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env file in client directory)
```
REACT_APP_API_URL=http://localhost:5000
```

## How to Run the Project

### 1. Start the Backend
```bash
cd server
npm install
npm start
```
This will start the backend server on port 5000.

### 2. Start the Frontend
```bash
cd client
npm install
npm start
```
This will start the frontend on port 3000.

## Configuration

If you need to change the ports or MongoDB connection:

1. Update the `.env` files in both client and server directories
2. Restart both services

## User Credentials

- Username: admin/user/business
- Password: 123

![doorstepservice_home](https://github.com/nivedpk21/Doorstepservice/assets/162270753/c3a27076-08b0-492f-be5a-eb1bbb30b5c6)


