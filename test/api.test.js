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
      expect(res.body).to.have.property("error", "Internal Server Error");

      createStub.restore(); // Restore the original method
    });
  });

  describe("PUT /products/:id", () => {
    let productId; // Variable to hold the ID of the product to be updated

    // Create a product before running each test
    beforeEach(async () => {
      const product = new Product({
        name: "Test Product", // Name of the product
        price: 10.0, // Price of the product
        quantity: 5, // Quantity of the product
        category: "Test Category", // Category of the product
      });
      const savedProduct = await product.save(); // Save the product to the database
      productId = savedProduct._id; // Store the product ID for later use in tests
    });

    // Test case for successfully updating a product
    it("should update a product successfully", async () => {
      const updatedProductData = {
        name: "Updated Product", // New name for the product
        price: 15.0, // New price for the product
        quantity: 10, // New quantity for the product
        category: "Updated Category", // New category for the product
      };

      // Send a PUT request to update the product
      const res = await request(app)
        .put(`/products/${productId}`) // Use the stored product ID
        .send(updatedProductData) // Send the updated product data
        .set("Content-Type", "application/json"); // Set the content type to JSON

      // Assertions to verify the response
      expect(res.status).to.equal(200); // Expect a 200 OK status
      expect(res.body.message).to.equal("Product updated successfully"); // Expect success message
      expect(res.body.product.name).to.equal(updatedProductData.name); // Check updated name
      expect(res.body.product.price).to.equal(updatedProductData.price); // Check updated price
      expect(res.body.product.quantity).to.equal(updatedProductData.quantity); // Check updated quantity
      expect(res.body.product.category).to.equal(updatedProductData.category); // Check updated category
    });

    // Test case for trying to update a non-existent product
    it("should return 404 if product not found", async () => {
      const nonExistentId = "60d5ec49f1b2c8b1f8e4b8c1"; // Use a random ID that doesn't exist

      // Send a PUT request to update a non-existent product
      const res = await request(app)
        .put(`/products/${nonExistentId}`)
        .send({
          name: "Non-existent Product", // Attempt to update with new data
          price: 20.0,
          quantity: 5,
          category: "Non-existent Category",
        })
        .set("Content-Type", "application/json");

      // Assertions to verify the response
      expect(res.status).to.equal(404); // Expect a 404 Not Found status
      expect(res.body.error).to.equal("Product not found"); // Expect error message
    });

    // Test case for missing required fields during update
    it("should return 400 if required fields are missing", async () => {
      // Send a PUT request with missing required fields
      const res = await request(app)
        .put(`/products/${productId}`)
        .send({
          price: 15.0, // Missing name, quantity, and category
        })
        .set("Content-Type", "application/json");

      // Assertions to verify the response
      expect(res.status).to.equal(400); // Expect a 400 Bad Request status
      expect(res.body.error).to.equal("Item name is required"); // Expect error message
    });
  });

  describe("DELETE /products/:id", () => {
    let productId; // Variable to hold the ID of the product to be deleted

    // Create a product before running each test
    beforeEach(async () => {
      const product = new Product({
        name: "Test Product", // Name of the product
        price: 10.0, // Price of the product
        quantity: 5, // Quantity of the product
        category: "Test Category", // Category of the product
      });
      const savedProduct = await product.save(); // Save the product to the database
      productId = savedProduct._id; // Store the product ID for later use in tests
    });

    // Test case for successfully deleting a product
    it("should delete a product successfully", async () => {
      // Send a DELETE request to delete the product
      const res = await request(app).delete(`/products/${productId}`);

      // Assertions to verify the response
      expect(res.status).to.equal(200); // Expect a 200 OK status
      expect(res.body.message).to.equal("Product deleted successfully"); // Expect success message

      // Verify that the product is actually deleted
      const deletedProduct = await Product.findById(productId); // Try to find the deleted product
      expect(deletedProduct).to.be.null; // Product should be null (not found)
    });

    // Test case for trying to delete a non-existent product
    it("should return 404 if product not found", async () => {
      const nonExistentId = "60d5ec49f1b2c8b1f8e4b8c1"; // Use a random ID that doesn't exist

      // Send a DELETE request to delete a non-existent product
      const res = await request(app).delete(`/products/${nonExistentId}`);

      // Assertions to verify the response
      expect(res.status).to.equal(404); // Expect a 404 Not Found status
      expect(res.body.error).to.equal("Product not found"); // Expect error message
    });
  });

  describe("GET /statistics", () => {
    beforeEach(async () => {
      // Add some products to the database for testing statistics
      await Product.insertMany([
        {
          name: "Apple",
          price: 1.5,
          quantity: 10,
          category: "Fruits & Vegetables",
        },
        {
          name: "Banana",
          price: 1.0,
          quantity: 20,
          category: "Fruits & Vegetables",
        },
        {
          name: "Carrot",
          price: 0.5,
          quantity: 15,
          category: "Fruits & Vegetables",
        },
        {
          name: "Chicken",
          price: 5.0,
          quantity: 5,
          category: "Meat & Poultry",
        },
      ]);
    });

    it("should return inventory statistics", async () => {
      const res = await request(app).get("/statistics");

      expect(res.status).to.equal(200); // Expect status 200
      expect(res.body).to.have.property("totalItems", 4); // Expect total items to be 4
      expect(res.body).to.have.property("totalQuantity", 50); // Expect total quantity to be 50
      expect(res.body).to.have.property("totalValue", 67.5); // Expect total value to be £67.5

      // Check category breakdown
      expect(res.body.categoryBreakdown).to.deep.equal({
        "Fruits & Vegetables": 3,
        "Meat & Poultry": 1,
      });
    });

    it("should return 500 if there is a server error", async () => {
      // Mock the Product.find method to throw an error
      const findStub = sinon
        .stub(Product, "find")
        .throws(new Error("Database error"));

      const res = await request(app).get("/statistics");
      expect(res.status).to.equal(500); // Expect status 500
      expect(res.body).to.have.property("error", "Internal Server Error"); // Expect error message

      findStub.restore(); // Restore the original method
    });
  });
});
