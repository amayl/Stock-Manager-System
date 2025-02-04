const request = require("supertest"); // Import supertest for HTTP assertions
const mongoose = require("mongoose"); // Import mongoose for MongoDB interactions
const app = require("../server/server.js"); // Import the server application
const userCollection = require("../database/users.js"); // Import user collection model
const Product = require("../database/productsDB.js"); // Import product collection model
const { expect } = require("chai"); // Import Chai's expect for assertions

// Connect to the test database before running tests
before(async () => {
  await mongoose.connect("mongodb://localhost:27017/stockManager", {
    useNewUrlParser: true, // Use new URL parser
    useUnifiedTopology: true, // Use unified topology
  });
});

// Clear the database before each test
beforeEach(async () => {
  await userCollection.deleteMany({}); // Delete all users
  await Product.deleteMany({}); // Delete all products
});

// Close the database connection after tests
after(async () => {
  await mongoose.connection.close(); // Close the mongoose connection
});

describe("API Tests", () => {
  describe("POST /signup", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/signup").send({
        // Send signup request
        fname: "John", // First name
        lname: "Doe", // Last name
        email: "john.doe@example.com", // Email address
        password: "password123", // Password
        role: "customer", // Role
      });
      expect(res.status).to.equal(200); // Expect status 200
      expect(res.body).to.have.property("message", "Registration Successful"); // Expect success message
    });

    it("should not register a user with existing email", async () => {
      await request(app).post("/signup").send({
        // First signup to create user
        fname: "Jane",
        lname: "Doe",
        email: "john.doe@example.com", // Existing email
        password: "password123",
        role: "customer",
      });

      const res = await request(app).post("/signup").send({
        // Attempt to register again with the same email
        fname: "John",
        lname: "Doe",
        email: "john.doe@example.com", // Same email
        password: "password123",
        role: "customer",
      });

      expect(res.status).to.equal(500); // Expect status 500 for error
      expect(res.body).to.have.property("error", "Internal Server Error"); // Expect error message
    });
  });

  describe("API Tests", () => {
    it("should register staff with the staff email", async () => {
      const res = await request(app).post("/signup").send({
        // Sign up staff with the staff email
        fname: "John",
        lanme: "Doe",
        email: "john@ntshfoods.com", // email ending in @ntshfoods.com
        password: "password123",
        role: "staff", // staff role
      });

      expect(res.status).to.equal(200); // Expects status 200
      expect(res.body).to.have.property("message", "Registration Successful"); // Expect success message
    });
  });

  describe("API Tests", () => {
    it("should register staff with the wrong email", async () => {
      const res = await request(app).post("/signup").send({
        // Sign up staff with the staff email
        fname: "John",
        lanme: "Doe",
        email: "john.doe@example.com", // wrong email
        password: "password123",
        role: "staff", // staff role
      });

      expect(res.status).to.equal(500); // Expects status 500
      expect(res.body).to.have.property("error", "Internal Server Error"); // Expect error message
    });
  });

  describe("POST /login", () => {
    it("should login a user", async () => {
      await request(app).post("/signup").send({
        // Signup a user first
        fname: "John",
        lname: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "password123",
      });

      const res = await request(app).post("/login").send({
        // Send login request
        email: "john.doe@example.com", // Email for login
        password: "password123", // Correct password
      });

      expect(res.status).to.equal(200); // Expect status 200
      expect(res.body).to.have.property("message", "Login successful"); // Expect success message
    });

    it("should not login with incorrect password", async () => {
      await request(app).post("/signup").send({
        // Signup a user first
        fname: "John",
        lname: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      const res = await request(app).post("/login").send({
        // Attempt to login with wrong password
        email: "john.doe@example.com",
        password: "wrongpassword", // Incorrect password
      });

      expect(res.status).to.equal(401); // Expect status 401 for unauthorized
      expect(res.body).to.have.property("error", "Password is incorrect"); // Expect error message
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app).post("/login").send({
        // Attempt to login with non-existent email
        email: "nonexistent@example.com", // Non-existent email
        password: "password123",
      });

      expect(res.status).to.equal(404); // Expect status 404 for not found
      expect(res.body).to.have.property("error", "Email does not exist"); // Expect error message
    });
  });
});
