import { requireAuth } from "@clerk/express";

import User from "../models/Users.js";

export const ProtectedRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId)
        return res
          .status(401)
          .json({ message: "unauthorized - invalid token" });

      const user = await User.findOne({ clerkId });

      if (!user) return res.status(404).json({ message: "User Not Found" });

      req.user = user;

      next();
    } catch (error) {
      console.error("Error in ProtectedRoute Middleware,", error);

      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
