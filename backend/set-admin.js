import mongoose from "mongoose";
import User from "./src/models/user.model.js";
import { cfg } from "./src/config/env.js";

async function setAdmin(email) {
  try {
    await mongoose.connect(cfg.mongoUri);
    console.log("Connected to MongoDB");

    const user = await User.findOneAndUpdate(
      { email: email },
      { role: "admin" },
      { new: true }
    );

    if (user) {
      console.log(`Successfully updated ${email} to admin role.`);
      console.log(user);
    } else {
      console.log(`User with email ${email} not found.`);
    }
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    await mongoose.disconnect();
  }
}

const email = process.argv[2];
if (!email) {
  console.log("Please provide an email address: node set-admin.js user@example.com");
  process.exit(1);
}

setAdmin(email);
