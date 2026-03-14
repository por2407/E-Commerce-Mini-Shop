export class OrderService {
  constructor(orderModel, productModel, userModel) {
    this.orderModel = orderModel;
    this.productModel = productModel;
    this.userModel = userModel;
  }

  async createOrder(userId, items) {
    let totalPrice = 0;
    const itemsWithPrice = [];

    for (const item of items) {
      const product = await this.productModel.findById(item.product);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }

      const itemPrice = product.price * item.quantity;
      totalPrice += itemPrice;

      itemsWithPrice.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price, // Get price from DB
      });
    }

    const order = new this.orderModel({
      user: userId,
      items: itemsWithPrice,
      total: totalPrice,
    });

    return await order.save();
  }

  async getOrdersByUser(userId) {
    return await this.orderModel
      .find({ user: userId })
      .populate("items.product", "name price imageUrl");
  }

  async getAllOrders() {
    // Use .lean() to get plain JS objects so spreading works as expected
    const orders = await this.orderModel.find().lean();
    const result = [];
    for (const order of orders) {
      const user = await this.userModel.findById(order.user).lean();
      result.push({
        ...order,
        name: user?.name,
      });
    }
    return result;
  }

  async updateOrderStatus(orderId, status) {
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
  }
}
