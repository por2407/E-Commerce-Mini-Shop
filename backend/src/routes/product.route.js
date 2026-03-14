import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

export const productRouter = (productController) => {
  const router = Router();

  router
    .route("/")
    .get(productController.getAllProducts)
    .post(protect, restrictTo("admin"), productController.createProduct);

  router
    .route("/:id")
    .get(productController.getProductById)
    .put(protect, restrictTo("admin"), productController.updateProduct)
    .delete(protect, restrictTo("admin"), productController.deleteProduct);

  return router;
};

