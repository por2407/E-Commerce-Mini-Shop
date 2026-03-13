import { Router } from "express";

export const orderRouter = (orderController) => {
  const router = Router();
    router.route("/")
    .get(orderController.getAllOrders)
    .post(orderController.createOrder);
    router.route("/user/:userId").get(orderController.getByOrders);
    return router;
};