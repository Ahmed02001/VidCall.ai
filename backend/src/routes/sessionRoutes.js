/**
 * @fileoverview Session Routes Module
 *
 * This module defines the Express.js routes for handling video call sessions.
 * It provides endpoints for creating, joining, ending, and retrieving session information.
 * All routes are protected and require user authentication.
 *
 * Routes:
 * - POST /: Create a new video call session
 * - GET /active: Retrieve all active sessions
 * - GET /my-resent: Get user's recent sessions (note: likely "recent" misspelled in controller)
 * - GET /:id: Get details of a specific session by ID
 * - POST /:id/join: Join an existing session
 * - POST /:id/end: End a specific session
 *
 * @module routes/sessionRoutes
 */

import express from "express";
import { ProtectedRoute } from "../middleware/requireAuth.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyResentSessions,
  getSessionById,
  joinSession,
} from "../controllers/sessionsController.js";

const router = express.Router();

// Session management routes
router.post("/", ProtectedRoute, createSession); // Create new session
router.get("/active", ProtectedRoute, getActiveSessions); // Get active sessions
router.get("/my-resent", ProtectedRoute, getMyResentSessions); // Get user's recent sessions
router.get("/:id", ProtectedRoute, getSessionById); // Get session by ID
router.post("/:id/join", ProtectedRoute, joinSession); // Join a session
router.post("/:id/end", ProtectedRoute, endSession); // End a session

export default router;
