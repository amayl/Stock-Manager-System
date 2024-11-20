const productCollection = require('/Users/amayl/Desktop/Computer Science/compsci things/github repositories /A Level Computer Science NEA/stock-management-system/database/products.js'); // Adjust the path accordingly

class Product {
    constructor(name, price, quantity, category) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }

    async save() {
        const product = new productCollection({
            name: this.name,
            price: this.price,
            quantity: this.quantity,
            category: this.category
        });
        return await product.save();
    }

    static async findAll() {
        return await productCollection.find({});
    }

}
