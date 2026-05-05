import dotenv from "dotenv";
dotenv.config({ path: ".env" }); 

import express from "express";
import cors from "cors";
import http from "http";
// import { Server } from "socket.io";

import connectDB from "./config/db.js";

// Routes
import userRoutes from "./routes/user.routes.js";
import authenticationRoutes from "./routes/authentication.routes.js";
import agencyRoutes from "./routes/agency.route.js";
import logsRoutes from "./routes/logs.routes.js";

const startServer = async () => {
  try {
    await connectDB(); // ✅ connect DynamoDB first

    const app = express();
    const server = http.createServer(app);

    // await User.table().create();
    // await Logs.table().create();
    // await Agency.table().create();

    // const io = new Server(server, { cors: { origin: "*" } });

    // ✅ Middlewares
    app.use(cors({ origin: "*" }));
    app.use(express.json({ limit: "20mb" }));
    app.use(express.urlencoded({ extended: true, limit: "20mb" }));

    // ✅ Request logger
    app.use((req, res, next) => {
      console.log(`➡️ ${req.method} ${req.originalUrl}`);
      next();
    });

    // ✅ Health check
    app.get("/", (req, res) => res.send("API is running..."));

    // ✅ Routes
    app.use("/api/user", userRoutes);
    app.use("/api/authenticate", authenticationRoutes);
    app.use("/api/agency", agencyRoutes);
    app.use("/api/logs", logsRoutes);

    // ✅ Socket handler
    // socketHandler(io);

    // ✅ 404 handler (keep last)
    app.use((req, res) => {
      return res.status(404).json({
        status: false,
        message: "Requested resource not found",
        method: req.method,
        path: req.originalUrl,
      });
    });

    // ✅ Error handler
    app.use((err, req, res, next) => {
      console.error("❌ Server Error:", err);
      return res.status(500).json({
        status: false,
        message: err.message || "Internal Server Error",
      });
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
