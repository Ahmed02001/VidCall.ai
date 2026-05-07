/**
 * @fileoverview Session Controller Module
 *
 * This module contains controller functions for managing video call sessions in the VidCall.ai application.
 * It handles session creation, retrieval, joining, and ending operations, integrating with Stream
 * for video calls and chat functionality.
 *
 * Key Features:
 * - Create sessions with problem statements and difficulty levels
 * - Retrieve active and completed sessions
 * - Join existing sessions (one participant per session)
 * - End sessions (host-only operation)
 * - Integration with Stream Video and Chat APIs
 *
 * @module controllers/sessionsController
 */

import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

/**
 * Creates a new video call session
 *
 * This function creates a new session with the specified problem and difficulty level.
 * It generates a unique call ID, creates the session in the database, sets up a Stream
 * video call, and creates a corresponding chat channel.
 *
 * @async
 * @function createSession
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.problem - The coding problem statement
 * @param {string} req.body.difficulty - The difficulty level (e.g., 'easy', 'medium', 'hard')
 * @param {Object} req.user - Authenticated user object (from middleware)
 * @param {string} req.user._id - User's database ID
 * @param {string} req.user.clerkId - User's Clerk authentication ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns JSON response with created session or error
 *
 * @throws {400} If problem or difficulty are missing
 * @throws {500} For internal server errors
 */
export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "Problem and Difficulty are required" });
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    res.status(201).json({ session: session });
  } catch (error) {
    console.error("Error in createSession controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
/**
 * Retrieves all active video call sessions
 *
 * Fetches sessions with status "active", populates host information,
 * and returns the most recent 20 sessions.
 *
 * @async
 * @function getActiveSessions
 * @param {Object} req - Express request object (unused)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns JSON response with active sessions array
 *
 * @throws {500} For internal server errors
 */
export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error in getActiveSessions controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
/**
 * Retrieves user's recent completed sessions
 *
 * Fetches sessions where the user was either the host or participant,
 * with status "completed", sorted by creation date (most recent first),
 * limited to 20 sessions.
 *
 * @async
 * @function getMyResentSessions
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's database ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns JSON response with user's recent sessions
 *
 * @throws {500} For internal server errors
 * @note Function name has typo: "Resent" should be "Recent"
 */
export async function getMyResentSessions(req, res) {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error in getMyResentSessions controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
/**
 * Retrieves a specific session by ID
 *
 * Fetches a session by its database ID and populates host and participant information.
 *
 * @async
 * @function getSessionById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Session database ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns JSON response with session details or error
 *
 * @throws {404} If session is not found
 * @throws {500} For internal server errors
 */
export async function getSessionById(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId");

    if (!session) return res.status(404).json({ message: "session not found" });

    return res.status(200).json({ session });
  } catch (error) {
    console.error("Error in getSessionById controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
/**
 * Allows a user to join an existing session
 *
 * Adds the authenticated user as a participant to the specified session.
 * Only one participant is allowed per session. Updates the chat channel membership.
 *
 * @async
 * @function joinSession
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Session database ID
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's database ID
 * @param {string} req.user.clerkId - User's Clerk authentication ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns JSON response with updated session or error
 *
 * @throws {404} If session is not found or already has a participant
 * @throws {500} For internal server errors
 */
export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "session not found" });

    if (session.status !== "active")
      return res
        .status(400)
        .json({ message: "cannot join a completed session" });

    if (session.host.toString() !== userId.toString())
      return res.status(400).json({
        message: "host cannot join  thier own session as participant",
      });

    if (session.participant)
      res.status(409).json({ message: "session is full" });

    session.participant = userId;
    await session.save();

    const channal = chatClient.channel("messaging", session.callId);
    await channal.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error in joinSession controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
/**
 * Ends a video call session (host only)
 *
 * Allows the session host to end the session. Updates session status to "completed",
 * deletes the Stream video call, and removes the chat channel.
 *
 * @async
 * @function endSession
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Session database ID
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User's database ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns JSON response with ended session or error
 *
 * @throws {404} If session is not found
 * @throws {403} If user is not the session host
 * @throws {400} If session is already completed
 * @throws {500} For internal server errors
 */
export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "session not found" });
    if (session.host.toString() !== userId.toString())
      return res
        .status(403)
        .json({ message: "Only host can end this session" });

    if (session.status === "completed")
      return res.status(400).json({ message: "session aready completed" });

    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    const channal = chatClient.channel("messaging", session.callId);
    await channal.delete();

    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: " session ended successfully" });
  } catch (error) {
    console.error("Error in endSession controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
