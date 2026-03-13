import { Router } from "express";

export const authRouter = (authController) => {
  const router = Router();
  router.route("/").get(authController.getAllUsers);
  router.route("/register").post(authController.register);
  router.route("/login").post(authController.login);
  return router;
};
