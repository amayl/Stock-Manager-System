const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const userCollection = require("/Users/amayl/Documents/Computer Science/compsci things/github repositories /A Level Computer Science NEA/stock-management-system/database/users.js");
const Product = require("../database/products");

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/stockManager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established"))
  .catch((err) => console.error("MongoDB connection error:", err));

const saltRounds = 10;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userCollection.findOne({ email: email });
    if (user) {
      if (await bcrypt.compare(password, user.userPassword)) {
        res.json("Login successful");
      } else {
        res.status(401).json({ message: "Password is incorrect" });
      }
    } else {
      res.json("Email does not exist");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/signup", async (req, res) => {
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

app.post("/staff-view", async (req, res) => {
  const { itemName, price, quantity, category } = req.body;

  try {
    const product = new Product(itemName, price, quantity, category);
    await product.save();
    res.status(201).send({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error during product creation:", error);
    res.status(500).send({ error: "Failed to create product" });
  }
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});

module.exports = app;
