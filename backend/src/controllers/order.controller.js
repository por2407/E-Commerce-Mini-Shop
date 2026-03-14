import { asyncHandler } from "../utils/asyncHandler.js";

export class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  createOrder = asyncHandler(async (req, res) => {
    // Security check: Admins cannot create orders
    if (req.user.role === "admin") {
      res.status(403);
      throw new Error("Admins are not allowed to create orders");
    }

    // Get userId from the authenticated user (from token)
    const userId = req.user._id;
    const { items } = req.body;
    const order = await this.orderService.createOrder(userId, items);
    res.status(201).json({ message: "Order created successfully", order });
  });


  getByOrders = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Security check: Only allow users to see their own orders, or allow admins to see any user's orders
    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      res.status(403);
      throw new Error("Not authorized to access these orders");
    }

    const orders = await this.orderService.getOrdersByUser(userId);
    res.status(200).json(orders);
  });

  //ของ admin
  getAllOrders = asyncHandler(async (req, res) => {
    const orders = await this.orderService.getAllOrders();
    res.status(200).json(orders);
  });

  updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await this.orderService.updateOrderStatus(
      orderId,
      status
    );
    res
      .status(200)
      .json({ message: "Order status updated", order: updatedOrder });
  });
}