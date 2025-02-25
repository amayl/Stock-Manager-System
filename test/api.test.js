const request = require("supertest"); // Import supertest for HTTP assertions
const mongoose = require("mongoose"); // Import mongoose for MongoDB interactions
const app = require("../server/server.js"); // Import the server application
const userCollection = require("../database/users.js"); // Import user collection model
const Product = require("../database/products.js"); // Import product collection model
const { expect } = require("chai"); // Import Chai's expect for assertions
const sinon = require("sinon"); // Import Sinon for mocking and stubbing

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
      expect(res.body).to.have.property("message"); // Expect success message
      expect(res.body.message).to.equal("Registration Successful"); // Expect success message
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
      expect(res.body).to.have.property("error"); // Expect error message
      expect(res.body.error).to.equal("Email already exists"); // Expect error message
    });

    it("should register staff with the staff email", async () => {
      const res = await request(app).post("/signup").send({
        // Sign up staff with the staff email
        fname: "John",
        lname: "Doe",
        email: "john@ntshfoods.com", // email ending in @ntshfoods.com
        password: "password123",
        role: "staff", // staff role
      });

      expect(res.status).to.equal(200); // Expects status 200
      expect(res.body).to.have.property("message"); // Expect success message
      expect(res.body.message).to.equal("Registration Successful"); // Expect success message
    });

    it("should not register staff with the wrong email", async () => {
      const res = await request(app).post("/signup").send({
        // Sign up staff with the wrong email
        fname: "John",
        lname: "Doe",
        email: "john.doe@example.com", // wrong email
        password: "password123",
        role: "staff", // staff role
      });

      expect(res.status).to.equal(500); // Expect status 500 for error
      expect(res.body).to.have.property("error"); // Expect error message
      expect(res.body.error).to.equal("Incorrect email for staff"); // Expect error message
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
        role: "customer",
      });

      const res = await request(app).post("/login").send({
        // Send login request
        email: "john.doe@example.com", // Email for login
        password: "password123", // Correct password
      });

      expect(res.status).to.equal(200); // Expect status 200
      expect(res.body).to.have.property("message"); // Expect success message
      expect(res.body.message).to.equal("Login successful"); // Expect success message
    });

    it("should not login with incorrect password", async () => {
      await request(app).post("/signup").send({
        // Signup a user first
        fname: "John",
        lname: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "customer",
      });

      const res = await request(app).post("/login").send({
        // Attempt to login with wrong password
        email: "john.doe@example.com",
        password: "wrongpassword", // Incorrect password
      });

      expect(res.status).to.equal(401); // Expect status 401 for unauthorized
      expect(res.body).to.have.property("error"); // Expect error message
      expect(res.body.error).to.equal("Password is incorrect"); // Expect error message
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app).post("/login").send({
        // Attempt to login with non-existent email
        email: "nonexistent@example.com", // Non-existent email
        password: "password123",
      });

      expect(res.status).to.equal(401); // Expect status 404 for not found
      expect(res.body).to.have.property("error"); // Expect error message
      expect(res.body.error).to.equal("Email does not exist"); // Expect error message
    });
  });

  describe("POST /staff-view", () => {
    it("should add a new item to the inventory", async () => {
      const newItem = {
        name: "Apple",
        category: "Fruits & Vegetables",
        quantity: 10,
        price: 1.5,
      };

      const res = await request(app).post("/staff-view").send(newItem);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Item added successfully");

      const products = await Product.find({});
      expect(products).to.have.lengthOf(1);
      expect(products[0]).to.include({
        name: newItem.name,
        price: newItem.price,
        quantity: newItem.quantity,
        category: newItem.category,
      });
    });

    it("should not add an item with missing fields", async () => {
      const newItem = {
        name: null,
        category: "Fruits & Vegetables",
        quantity: 10,
        price: 1.5,
      };
      const res = await request(app).post("/staff-view").send(newItem);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error", "Item name is required");
    });

    it("should not add an item with invalid data", async () => {
      const newItem = {
        name: "Banana",
        category: "Fruits & Vegetables",
        quantity: -5, // Invalid quantity
        price: -1.0, // Invalid price
      };

      const res = await request(app).post("/staff-view").send(newItem);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property(
        "error",
        "Quantity and price must be positive"
      );
    });

    it("should not add an item with wrong data type", async () => {
      const newItem = {
        name: "Grapes",
        category: "Fruits & Vegetables",
        quantity: 4.23, // Invalid quantity
        price: "twenty four", // Invalid price
      };

      const res = await request(app).post("/staff-view").send(newItem);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property(
        "error",
        "Price must be a float, quantity must be an integer"
      );
    });

    it("should fetch inventory items", async () => {
      const newItem = {
        name: "Orange",
        category: "Fruits & Vegetables",
        quantity: 20,
        price: 2.0,
      };

      await request(app).post("/staff-view").send(newItem);

      const res = await request(app).get("/staff-view");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").that.is.not.empty;
      expect(res.body[0]).to.include(newItem);
    });

    it("should handle server errors gracefully", async () => {
      // Simulate a server error by mocking the database call
      const newItem = {
        name: "Grapes",
        category: "Fruits & Vegetables",
        quantity: 15,
        price: 3.0,
      };

      // Mocking the Product.create method to throw an error
      const createStub = sinon
        .stub(Product, "create")
        .throws(new Error("Database error"));

      const res = await request(app).post("/staff-view").send(newItem);
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("error", "Internal server error");

      createStub.restore(); // Restore the original method
    });
  });
});
