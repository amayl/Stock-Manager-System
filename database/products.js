const mongoose = require("mongoose");

// Define the product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
});

// Create the product model
const Product = mongoose.model("Products", productSchema);

module.exports = Product; // Export the model
