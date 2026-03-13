export class ProductService {
    constructor(productModel) {
        this.productModel = productModel;
    }

    async getAllProducts() {
        return await this.productModel.find();
    }

    async getProductById(id) {
        return await this.productModel.findById(id);
    }

    async createProduct(productData) {
        const product = new this.productModel(productData);
        return await product.save();
    }

    async updateProduct(id, productData) {
        return await this.productModel.findByIdAndUpdate(id, productData, { new: true });
    }

    async deleteProduct(id) {
        return await this.productModel.findByIdAndDelete(id);
    }
}