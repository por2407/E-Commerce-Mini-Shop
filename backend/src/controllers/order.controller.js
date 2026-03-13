import {asyncHandler} from "../utils/asyncHandler.js";
export class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  createOrder = asyncHandler(async (req, res) => {
    const { userId, items } = req.body;
    const order = await this.orderService.createOrder(userId, items);
    res.status(201).json({ message: "Order created successfully", order });
  });

  getByOrders = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const orders = await this.orderService.getOrdersByUser(userId);
    res.status(200).json(orders);
  });

  //ของ admin
    getAllOrders = asyncHandler(async (req, res) => {
    const orders = await this.orderService.getAllOrders();
    res.status(200).json(orders);
  });

}