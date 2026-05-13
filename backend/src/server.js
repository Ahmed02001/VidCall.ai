import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

const __dirname = path.resolve();

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/chat", chatRoutes);
app.use("/sessions", sessionRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "VidCall.ai backend" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "sccess to health endpoint API" });
});

if (ENV.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

startServer();
async function startServer() {
  if (!ENV.DB_URL) {
    throw new Error("DB_URL is not defined in environment variable");
  }
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server Running on Port ${ENV.PORT}`);
  });
}
