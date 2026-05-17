/**
 * @fileoverview Authentication Middleware
 *
 * This module exports the `ProtectedRoute` middleware array used to secure API routes.
 * It integrates with Clerk for JWT verification and syncs the authenticated user
 * with the local MongoDB database.
 *
 * @module middleware/requireAuth
 */

import { requireAuth } from "@clerk/express";
import User from "../models/Users.js";
import { ENV } from "../lib/env.js";

/**
 * Express middleware array for protecting routes.
 *
 * 1. `requireAuth()`: Clerk middleware to verify the JWT and inject `req.auth`.
 * 2. Custom async middleware: Fetches the user from MongoDB using `clerkId`.
 *    - If the user doesn't exist locally, it fetches their profile from the Clerk API.
 *    - It handles race conditions (E11000 duplicate key error) when creating the user.
 *    - Finally, it attaches the MongoDB user document to `req.user`.
 *
 * @type {Array<Function>}
 */
export const ProtectedRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId)
        return res
          .status(401)
          .json({ message: "unauthorized - invalid token" });

      let user = await User.findOne({ clerkId });

      if (!user) {
        if (!ENV.CLERK_SECRET_KEY) {
          console.error("CLERK_SECRET_KEY is not configured in ENV");
          return res.status(500).json({
            message: "Clerk secret key is missing",
          });
        }

        try {
          const response = await fetch(
            `https://api.clerk.dev/v1/users/${clerkId}`,
            {
              headers: {
                Authorization: `Bearer ${ENV.CLERK_SECRET_KEY}`,
              },
            },
          );

          if (!response.ok) {
            console.error(
              `Clerk API error: ${response.status} ${response.statusText}`,
            );
            return res.status(404).json({ message: "User Not Found" });
          }

          const clerkUser = await response.json();
          const email =
            clerkUser.email_addresses?.[0]?.email_address ||
            `${clerkId}@clerk.local`;
          const name = [clerkUser.first_name, clerkUser.last_name]
            .filter(Boolean)
            .join(" ")
            .trim();

          let existingUser = await User.findOne({ email });

          if (existingUser) {
            existingUser.clerkId = clerkId;
            existingUser.name = name || existingUser.name;
            existingUser.profileImage = clerkUser.image_url || existingUser.profileImage;
            await existingUser.save();
            user = existingUser;
            console.log("Existing user updated with Clerk ID:", user._id);
          } else {
            try {
              user = await User.create({
                clerkId,
                name: name || email,
                email,
                profileImage: clerkUser.image_url || "",
              });
              console.log("User created from Clerk:", user._id);
            } catch (createError) {
              if (createError.code === 11000) {
                user = await User.findOne({ email });
                if (!user) throw createError;

                // If it was created in a race condition but without our current clerkId
                if (user.clerkId !== clerkId) {
                  user.clerkId = clerkId;
                  await user.save();
                }
              } else {
                throw createError;
              }
            }
          }
        } catch (clerkError) {
          console.error("Error fetching from Clerk API:", clerkError.message);
          throw clerkError;
        }
      }

      if (!user.image && user.profileImage) {
        user.image = user.profileImage;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error in ProtectedRoute Middleware:", error);

      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
