import mongoose from "mongoose";
import { cfg } from "./env.js";

export async function connectDatabase() {
  await mongoose.connect(cfg.mongoUri);
  console.log("Connected to MongoDB");
}
