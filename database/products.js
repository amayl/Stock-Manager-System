class Product {
    constructor(name, price, quantity, category) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }

    async save() {
        const product = new ProductModel({
            name: this.name,
            price: this.price,
            quantity: this.quantity,
            category: this.category
        });
        return await product.save(); // This saves the product to the MongoDB collection
    }

    static async findAll() {
        return await ProductModel.find({}); // This retrieves all products from the collection
    }
}

module.exports = Product; // Export the Product class