# VidCall.ai

A modern, full-stack video calling application built with React, Node.js, and Stream Chat. VidCall.ai enables users to connect, communicate, and collaborate through high-quality video calls with integrated messaging capabilities.

## 🚀 Features

- **Video Calling**: Real-time video communication with Stream Video integration.
- **Messaging**: Integrated chat system for seamless communication.
- **Authentication**: Secure user authentication with Clerk.
- **Database**: MongoDB for persistent data storage.
- **Event Processing**: Inngest for reliable event-driven workflows and Webhooks.
- **Code Execution**: Built-in IDE capabilities for solving coding problems.
- **Production Ready**: Serves built frontend assets in production mode.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Integrations**: Stream SDK (Video & Chat), Clerk (Auth)
- **Event Processing**: Inngest
- **Development**: Nodemon for hot-reloading
- **Middleware**: CORS for cross-origin requests

### Frontend
- **Framework**: React 19 (via Vite)
- **Data Fetching**: React Query (@tanstack/react-query)
- **Authentication**: Clerk React
- **Video/Chat UI**: Stream React SDK
- **Styling**: Tailwind CSS & DaisyUI
- **Routing**: React Router

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **MongoDB** (local instance or MongoDB Atlas connection string)

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Ahmed02001/VidCall.ai.git
cd VidCall.ai
```

### 2. Install Dependencies
**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Environment Configuration

**Backend (`backend/.env`)**
```env
PORT=5055
NODE_ENV=development
DB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
STREAM_API_KEY=your_stream_key
STREAM_API_SECRET=your_stream_secret
CLERK_SECRET_KEY=your_clerk_secret
```

**Frontend (`frontend/.env`)**
```env
VITE_API_URL=http://localhost:5055
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_key
```

## 🏃 Running the Project

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

### Production Mode
Build the frontend and start the backend (which serves the frontend):
```bash
npm run build
npm start
```

## 📁 Project Structure

```
VidCall.ai/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express server entry point
│   │   ├── controllers/           # Route controllers (sessionsController, etc.)
│   │   ├── routes/                # API routes (sessionRoutes, chatRoutes)
│   │   ├── middleware/            # Custom middleware (requireAuth for Clerk verification)
│   │   ├── models/
│   │   │   ├── Users.js           # User data model
│   │   │   └── Session.js         # Video call session data model
│   │   └── lib/
│   │       ├── db.js              # MongoDB connection
│   │       ├── env.js             # Environment configuration
│   │       ├── inngest.js         # Event processing setup (Webhooks)
│   │       └── stream.js          # Stream Chat and Video integration
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── api/                   # Axios API instances and endpoints (sessions.js)
│   │   ├── hooks/                 # Custom React Query hooks (useSessions, useStreamClient)
│   │   ├── pages/                 # Route pages (SessionPage, etc.)
│   │   ├── components/            # Reusable UI components
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── vite.config.js             # Vite configuration
│   └── package.json
└── package.json                   # Root package file
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Check if the server is running

### Sessions API (`/sessions`)
- `POST /` - Create a new video call session
- `GET /active` - Retrieve all active sessions
- `GET /my-resent` - Get user's recent sessions
- `GET /:id` - Get details of a specific session by ID
- `POST /:id/join` - Join an existing session
- `POST /:id/end` - End a specific session

### Chat API (`/chat`)
- `GET /token` - Generate Stream Chat token for current user

### Webhooks
- `POST /api/inngest` - Event processing endpoint for Inngest webhooks

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License
This project is licensed under the ISC License.

## 👨‍💻 Author
- Ahmed ([@Ahmed02001](https://github.com/Ahmed02001))
