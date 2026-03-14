import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

export const orderRouter = (orderController) => {
  const router = Router();
  router
    .route("/")
    .get(protect, restrictTo("admin"), orderController.getAllOrders)
    .post(protect, orderController.createOrder);

  router.route("/user/:userId").get(protect, orderController.getByOrders);
  router
    .route("/:orderId/status")
    .put(protect, restrictTo("admin"), orderController.updateOrderStatus);
  return router;
};
