import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { cfg } from "./config/env.js";
import { router } from "./routes/index.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);

  // ── Global Middleware ─────────────────────────────────────────────
  app.use(
    cors({
      origin: cfg.clientOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(cookieParser());

  // ── Health Check ──────────────────────────────────────────────────
  app.get("/test", (req, res) => {
    res.json({ success: true, message: "Server is running" });
  });

  // ── API Routes ────────────────────────────────────────────────────
  app.use("/api", router);

  // ── Error Handling (must be last) ─────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
