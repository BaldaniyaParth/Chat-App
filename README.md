# Chat Application

## Overview
This is a chat application built using Node.js, Express.js, MongoDB, Socket.IO, and other technologies. It provides features like user authentication, real-time messaging, chat editing and deletion, profile picture upload, and more.

## Features
- User Authentication: Users can register and log in to access the chat application.
- User Authorization: Only authenticated users can access the dashboard, and non-authenticated users are redirected to the login/register page.
- Real-Time Messaging: Users can chat with each other in real-time.
- Message Editing and Deletion: Users can edit and delete their own messages.
- Profile Picture Upload: Users can upload a profile picture during registration.

## Technology Stack
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Real-Time Communication: Socket.IO
- Authentication and Authorization: bcrypt, express-session, cookie-parser
- File Upload: Multer, Cloudinary
- Frontend Templating Engine: EJS
- Other Middleware: body-parser, cors

## Setup Instructions

### Backend Setup

1. Clone this repository to your local machine.
```bash
git clone <repository-url>
```

2. Navigate to the project directory.
```bash
cd chat-application
```

3. Install dependencies.
```bash
npm install
```

4. Configure environment variables.
- Create a .env file in the root directory.
- Add the necessary environment variables ((e.g., MongoDB connection string, session secret, Cloudinary credentials).)
    - Example : - PORT = 8000
                - MONGODB_URL = "mongodb+srv://<Your Name>:<Your Password>@chat-app.xzstind.mongodb.net/Chat-App?retryWrites=true&w=majority&appName=Chat-App"
                - SESSION_SECRET = "YourSessionSecret"
                - cloud_name = "Your Cloud Name"
                - api_key = "Your Cloudinary API Key"
                - api_secret = "Your Cloudinary API Secret"

5. Start the server.
```bash
npm start
```

### Frontend Setup

1. Ensure that the backend server is running.
2. Open a web browser and navigate to the URL where the backend server is hosted (e.g., http://localhost:8000).
3. You should see the login/register page. Follow the instructions to register or log in.
4. After logging in, you'll be redirected to the dashboard where you can start chatting with other users.

