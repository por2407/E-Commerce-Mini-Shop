import { Router } from "express";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { AuthService } from "../services/auth.service.js";
import { ProductService } from "../services/product.service.js";
import {OrderService} from "../services/order.service.js";
import { AuthController } from "../controllers/auth.controller.js";
import { ProductController } from "../controllers/product.controller.js";
import { OrderController } from "../controllers/order.controller.js";
import { authRouter } from "./auth.route.js";
import { productRouter } from "./product.route.js";
import { orderRouter } from "./order.route.js";

const router = Router();

// ── Dependency Injection ──────────────────────────────────────────
const authService = new AuthService(User);
const authController = new AuthController(authService);

const productService = new ProductService(Product);
const productController = new ProductController(productService);

const orderService = new OrderService(Order, Product, User);
const orderController = new OrderController(orderService);

// ── Register Routes ───────────────────────────────────────────────
router.use("/auth", authRouter(authController));
router.use("/products", productRouter(productController));
router.use("/orders", orderRouter(orderController));

export { router };
