import { Router } from "express";

export const productRouter = (productController) => {
  const router = Router();

  router
    .route("/")
    .get(productController.getAllProducts)
    .post(productController.createProduct);

  router
    .route("/:id")
    .get(productController.getProductById)
    .put(productController.updateProduct)
    .delete(productController.deleteProduct);

  return router;
};
