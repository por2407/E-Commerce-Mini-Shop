import http from "http";
import { cfg } from "./src/config/env.js";
import { createApp } from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";

async function startServer() {
  try {
    await connectDatabase();
    const app = createApp();
    const server = http.createServer(app);
    server.listen(cfg.port, () => {
      console.log(`Server is running on port ${cfg.port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
