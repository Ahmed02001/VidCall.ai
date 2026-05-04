import mongoose from "mongoose";

import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("✅Connected to Db ", conn.connection.host);
  } catch (error) {
    console.error("❌error", error);
    process.exit(1);
  }
};
