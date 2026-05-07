/**
 * @fileoverview Session Model Module
 *
 * This module defines the MongoDB schema for video call sessions in the VidCall.ai application.
 * Sessions represent coding collaboration meetings between a host and a participant.
 *
 * Schema Fields:
 * - problem: The coding problem or topic for the session
 * - difficulty: The difficulty level of the problem (easy, medium, hard)
 * - host: Reference to the user who created/hosts the session
 * - participant: Reference to the user who joined the session (optional)
 * - status: Current state of the session (active, completed)
 * - callId: Unique identifier for the Stream video call
 * - timestamps: Automatically tracks creation and modification times
 *
 * @module models/Session
 */

import mongoose from "mongoose";

/**
 * Session Schema
 *
 * Represents a video call session for collaborative coding practice.
 * Each session pairs a host (creator) with an optional participant (joiner).
 *
 * @type {mongoose.Schema}
 */
const sessionSchema = new mongoose.Schema(
  {
    /**
     * Coding problem statement or topic
     * @type {String}
     * @required
     */
    problem: {
      type: String,
      required: true,
    },
    /**
     * Difficulty level of the coding problem
     * @type {String}
     * @enum {string}
     * @required
     */
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    /**
     * Reference to the user who created and hosts the session
     * @type {mongoose.Schema.Types.ObjectId}
     * @ref {User}
     * @required
     */
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /**
     * Reference to the user who joined the session
     * Null if no one has joined yet - max 1 participant per session
     * @type {mongoose.Schema.Types.ObjectId}
     * @ref {User}
     * @default null
     */
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    /**
     * Current state of the session
     * Note: Enum value previously had typo "complated" - now corrected to "completed"
     * @type {String}
     * @enum {string}
     * @default "active"
     */
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    /**
     * Unique identifier for the Stream video call
     * Used to link the session with the video call infrastructure
     * @type {String}
     * @default ""
     */
    callId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

/**
 * Session Model
 *
 * MongoDB model for managing video call sessions.
 * Represents collaborative coding sessions where users pair for practice.
 *
 * @type {mongoose.Model}
 * @name Session
 */
const Session = mongoose.model("Session", sessionSchema);

export default Session;
