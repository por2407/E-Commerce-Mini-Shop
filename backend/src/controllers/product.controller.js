import { asyncHandler } from "../utils/asyncHandler.js";
export class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  getAllProducts = asyncHandler(async (req, res) => {
    const products = await this.productService.getAllProducts();
    res.status(200).json(products);
  });

  getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await this.productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  });

  createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, imageUrl, stock } = req.body;
    const product = await this.productService.createProduct({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
    });
    res.status(201).json({ message: "Product created successfully", product });
  });

  updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, imageUrl, stock } = req.body;
    const updatedProduct = await this.productService.updateProduct(id, {
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  });

  deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await this.productService.deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  });
}
