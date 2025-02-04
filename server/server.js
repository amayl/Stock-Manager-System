const express = require("express"); // import express for the app
const cors = require("cors");
const mongoose = require("mongoose"); // mongodb import
const app = express(); // app instance (server object)
const path = require("path");
const bcrypt = require("bcrypt");
const userCollection = require("/Users/amayl/Documents/Computer Science/compsci things/github repositories /A Level Computer Science NEA/stock-management-system/database/users.js");
const Product = require("../database/products");

// Middleware
app.use(cors()); // allow all origins
app.use(express.json()); // to parse the JSON body

// MongoDB connection
if (!mongoose.connection || mongoose.connection.readyState === 0) {
  mongoose.connect("mongodb://localhost:27017/stockManager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
const db = mongoose.connection;
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
db.once("open", () => {
  console.log("MongoDB connection established");
});

const saltRounds = 10; // Recommended salt rounds for bcrypt

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body; // Get email and password from request body
  userCollection.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json("Login successful");
      } else {
        res.status(401).json({ message: "Password is incorrect" });
      }
    } else {
      res.json("Email does not exist");
    }
  });
});

app.post("/signup", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(saltRounds); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

    // Create a new user instance with the hashed password
    const user = new userCollection({
      fname,
      lname,
      email,
      userPassword: hashedPassword, // Store the hashed password
    });

    // Save the user to the database
    await user.save();
    console.log(user);
    res.send({ message: "Registration Successful" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send({ error: "Internal Server Error" }); // Handle errors
  }
});

app.post("/staff-view", async (req, res) => {
  const { itemName, price, quantity, category } = req.body;

  console.time();
  // Create a new product instance using the Product class
  const product = new Product(itemName, price, quantity, category);

  try {
    // Save the product to the database
    await product.save(); // This line calls the save method in the Product class
    res.status(201).send({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error during product creation:", error);
    res.status(500).send({ error: "Failed to create product" });
  }
  console.timeEnd();
});

// Start the server
app.listen(4000, () => {
  console.log("Server running on port 4000"); // sends message to the console upon running
});

module.exports = app; // Export the app instance

// Fix 1: Instead, you should store hashed and salted versions of the passwords and compare the hashed versions.

// Fix 2: You should add try-catch blocks to handle any potential errors.

// Fix 3: You should add validation to ensure that the input data is correct and consistent.

// Fix 4: You should use a consistent approach to handle errors, such as using try-catch blocks or error handling middleware.

// Fix 5: You should add headers like Content-Security-Policy, X-Frame-Options, and X-XSS-Protection to enhance security.
