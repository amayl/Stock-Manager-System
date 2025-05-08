// Import the mongoose module

const mongoose = require("mongoose");

// Create a user schema
const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  userPassword: String, // Renamed to userPassword for clarity
});

const loginSchema = new mongoose.Schema({
  email: String,
  userPassword: String,
});

const userCollection = mongoose.model("Users", userSchema);
module.exports = userCollection;
