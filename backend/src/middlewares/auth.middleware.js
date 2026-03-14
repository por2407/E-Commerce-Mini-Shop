import jwt from "jsonwebtoken";
import { cfg } from "../config/env.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    const error = new Error("Not authorized, no token");
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, cfg.jwtSecret);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    error.statusCode = 401;
    error.message = "Not authorized, token failed";
    throw error;
  }

});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error(`User role ${req.user.role} is not authorized to access this route`);
      error.statusCode = 403;
      throw error;
    }
    next();
  };
};

