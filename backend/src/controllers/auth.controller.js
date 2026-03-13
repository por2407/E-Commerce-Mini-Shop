import { asyncHandler } from "../utils/asyncHandler.js";
import { cfg } from "../config/env.js";
export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await this.authService.register(name, email, password);
    res.status(201).json({ message: "User registered successfully", user });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await this.authService.login(email, password);
    const { token, ...safeUser } = user;
    const isProduction = cfg.nodeEnv === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successful", user: safeUser });
  });

  getAllUsers = asyncHandler(async (req, res) => {
    const users = await this.authService.getAllUsers();
    res.status(200).json(users);
  });
}
