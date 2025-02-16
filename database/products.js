// class Product {
//   constructor(name, price, quantity, category) {
//     this.name = name;
//     this.price = price;
//     this.quantity = quantity;
//     this.category = category;
//   }

//   async save() {
//     const product = new Product({
//       name: this.name,
//       price: this.price,
//       quantity: this.quantity,
//       category: this.category,
//     });
//     return await product.save(); // This saves the product to the MongoDB collection
//   }

//   static async findAll() {
//     return await Product.find({}); // This retrieves all products from the collection
//   }
// }

// module.exports = Product; // Export the Product class

const mongoose = require("mongoose");

// Define the product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
});

// Create the product model
const Product = mongoose.model("Product", productSchema);

module.exports = Product; // Export the model
