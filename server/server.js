const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();
const userCollection = require("../database/users.js");
const Product = require("../database/products");
require("dotenv").config();

// Middleware
app.use(express.static("./public"));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public"))); // Serve static files
// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas connection established"))
  .catch((err) => console.error("MongoDB Atlas connection error:", err));

const saltRounds = 10;

// Redirect root URL to signup page
app.get("/", (req, res) => {
  res.redirect("/signup.html"); // Redirect to the signup page
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await userCollection.findOne({ email: email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.userPassword);
      if (isPasswordValid) {
        return res.json({ message: "Login successful" }); // returns object message
      } else {
        return res.status(401).json({ error: "Password is incorrect" }); // return object error
      }
    }

    // If user is not found, return invalid email or password
    res.status(401).json({ error: "Email does not exist" }); // return object error
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" }); // return object error
  }
});

app.post("/api/signup", async (req, res) => {
  const { fname, lname, email, password, role } = req.body;
  try {
    // Check if the email already exists
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(500).send({ error: "Email already exists" });
    }

    if (role == "staff" && !email.includes("@ntshfoods.com")) {
      return res.status(500).send({ error: "Incorrect email for staff" });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userCollection({
      fname,
      lname,
      email,
      userPassword: hashedPassword,
      role,
    });

    await user.save();
    console.log(user);
    res.send({ message: "Registration Successful" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Endpoint to add a product
app.post("/api/staff-view", async (req, res) => {
  const { name, price, quantity, category } = req.body;

  // Check for missing fields
  if (!name) {
    return res.status(400).json({ error: "Item name is required" });
  }
  if (price < 0 || quantity < 0) {
    return res
      .status(400)
      .json({ error: "Quantity and price must be positive" });
  }
  if (typeof price !== "number" || typeof quantity !== "number") {
    return res
      .status(400)
      .json({ error: "Price must be a float, quantity must be an integer" });
  }
  if (typeof name !== "string" || quantity % 1 !== 0) {
    return res.status(400).json({
      error: "Item name must be a string and quantity must be an integer value",
    });
  }

  try {
    const savedProduct = await Product.create({
      name,
      price,
      quantity,
      category,
    });
    res.send({
      message: "Item added successfully",
      itemName: savedProduct.name,
      id: savedProduct._id, // Return the new product ID
    });
  } catch (error) {
    console.error("Error during product addition:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Endpoint to get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.json(products); // Send the products as a JSON response
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to update a product
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params; // Get the product ID from the URL
  const { name, price, quantity, category } = req.body; // Get the updated data from the request body

  // Check for missing fields
  if (!name) {
    return res.status(400).json({ error: "Item name is required" });
  }
  if (price < 0 || quantity < 0) {
    return res
      .status(400)
      .json({ error: "Quantity and price must be positive" });
  }
  if (typeof price !== "number" || typeof quantity !== "number") {
    return res
      .status(400)
      .json({ error: "Price must be a float, quantity must be an integer" });
  }
  if (typeof name !== "string" || quantity % 1 !== 0) {
    return res.status(400).json({
      error: "Item name must be a string and quantity must be an integer value",
    });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, quantity, category },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to delete a product
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params; // Get the product ID from the URL

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get all products
app.get("/api/staff-view", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.json(products); // Send the products as a JSON response
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get inventory statistics
app.get("/api/statistics", async (req, res) => {
  try {
    const products = await Product.find();
    const totalItems = products.length;
    const totalQuantity = products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );
    const totalValue = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    // Calculate category breakdown
    const categoryBreakdown = {};
    products.forEach((product) => {
      categoryBreakdown[product.category] =
        (categoryBreakdown[product.category] || 0) + 1;
    });

    res.json({
      totalItems,
      totalQuantity,
      totalValue,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get low stock products
app.get("/api/low-stock", async (req, res) => {
  const lowStockThreshold = 50; // Define your low stock threshold here
  // low stock defined to be 50
  try {
    const lowStockProducts = await Product.find({
      quantity: { $lt: lowStockThreshold },
    });

    if (lowStockProducts.length === 0) {
      return res.json({ message: "No low stock products." });
    }

    res.json(lowStockProducts);
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});

module.exports = app;
