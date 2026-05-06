import express from "express";
import { getStreamToken } from "../controllers/chatController.js";
import { ProtectedRoute } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/token", ProtectedRoute, getStreamToken);

export default router;
