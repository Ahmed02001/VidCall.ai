# VidCall.ai

A modern, full-stack video calling application built with React, Node.js, and Stream Chat. VidCall.ai enables users to connect, communicate, and collaborate through high-quality video calls with integrated messaging capabilities.

## 🚀 Features

- **Video Calling**: Real-time video communication with Stream Chat integration
- **Messaging**: Integrated chat system for seamless communication
- **Authentication**: Secure user authentication with Clerk
- **Database**: MongoDB for persistent data storage
- **Event Processing**: Inngest for reliable event-driven workflows
- **CORS Support**: Cross-origin resource sharing for frontend-backend communication
- **Production Ready**: Serves built frontend assets in production mode

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.19.1
- **Authentication**: Stream Chat SDK 9.24.0
- **Event Processing**: Inngest 3.54.2
- **Development**: Nodemon for hot-reloading
- **Middleware**: CORS for cross-origin requests

### Frontend

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Authentication**: Clerk React 6.5.0
- **Styling**: CSS
- **Linting**: ESLint with React plugin support

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

Install dependencies for both backend and frontend:

```bash
npm run build
```

Or install them separately:

**Backend:**

```bash
cd backend
npm install
cd ..
```

**Frontend:**

```bash
cd frontend
npm install
cd ..
```

### 3. Environment Configuration

#### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
DB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
# Add other required environment variables (Stream Chat, Clerk tokens, etc.)
```

#### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# Add other required environment variables
```

## 🏃 Running the Project

### Development Mode

**Terminal 1 - Start Backend:**

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Mode

Build and start the application:

```bash
npm run build
npm start
```

### Available Scripts

**Backend:**

- `npm run dev` - Start backend server with hot-reload (development)
- `npm start` - Start backend server (production)

**Frontend:**

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

**Root:**

- `npm run build` - Install dependencies and build frontend
- `npm start` - Start backend server in production

## 📁 Project Structure

```
VidCall.ai/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express server entry point
│   │   ├── controllers/           # Route controllers (empty - ready for expansion)
│   │   ├── routes/                # API routes (empty - ready for expansion)
│   │   ├── middleware/            # Custom middleware
│   │   ├── models/
│   │   │   └── Users.js          # User data model
│   │   └── lib/
│   │       ├── db.js              # MongoDB connection
│   │       ├── env.js             # Environment configuration
│   │       ├── inngest.js         # Event processing setup
│   │       └── stream.js          # Stream Chat integration
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app component
│   │   ├── App.css                # App styles
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── public/                    # Static assets
│   ├── index.html                 # HTML template
│   ├── vite.config.js             # Vite configuration
│   ├── eslint.config.js           # ESLint configuration
│   ├── package.json
│   └── README.md
├── package.json                   # Root package file
├── vercel.json                    # Vercel deployment configuration
└── README.md                      # This file
```

## 🔌 API Endpoints

### Health Check

- `GET /health` - Check if the server is running

### Inngest

- `POST /api/inngest` - Event processing endpoint

## 🗄️ Database

The application uses MongoDB for data persistence. Configure your MongoDB connection string in the backend `.env` file:

```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/vidcall
```

## 🔐 Authentication

The application integrates with **Clerk** for authentication:

1. Set up a Clerk account at [clerk.com](https://clerk.com)
2. Add your Clerk publishable key to the frontend `.env`
3. Configure Clerk backend API keys for backend integration

## 💬 Chat Integration

The project uses **Stream Chat** for real-time messaging:

1. Set up a Stream Chat account at [getstream.io](https://getstream.io)
2. Configure Stream Chat SDK in `backend/src/lib/stream.js`
3. Add API keys to your backend `.env` file

## 🚀 Deployment

### Vercel Deployment

This project is configured for Vercel deployment:

```bash
vercel
```

The `vercel.json` file contains deployment configuration.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

For support, issues, or questions:

- Open an issue on [GitHub Issues](https://github.com/Ahmed02001/VidCall.ai/issues)
- Check the project documentation
- Review existing issues for solutions

## 👨‍💻 Authors

- Ahmed ([@Ahmed02001](https://github.com/Ahmed02001))

## 🔄 Version History

- **v1.0.0** - Initial release

---

**Happy coding! 🎉**
