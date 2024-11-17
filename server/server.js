const express = require('express'); // import express for the app
const cors = require('cors');
const mongoose = require('mongoose'); // mongodb import
const app = express(); // app instance (server object)
const path = require('path');
const bcrypt = require('bcrypt');
const userCollection = require('/Users/amayl/Desktop/Computer Science/compsci things/github repositories /A Level Computer Science NEA/stock-management-system/database/users.js')

// Middleware
app.use(cors()); // allow all origins
app.use(express.json()); // to parse the JSON body

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/stockManager');
const db = mongoose.connection;
db.once('open', () => {
    console.log('MongoDB connection established');
});

const saltRounds = 10; // Recommended salt rounds for bcrypt


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body; // Get email and password from request body
    userCollection.findOne({email: email})
    .then(user => {
        if (user) {
            if (user.password == password) {
                res.json('Login successful')
            }
            else {
                res.json('Password is incorrect')
            }
        }
        else {
            res.json('Email does not exist')
        }
    })
});


app.post('/signup', async (req, res) => {
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
            userPassword: hashedPassword // Store the hashed password
        });

        // Save the user to the database
        await user.save();
        console.log(user);
        res.send({ message: "Registration Successful" });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send({ error: "Internal Server Error" }); // Handle errors
    }
});

// Start the server
app.listen(4000, () => {
    console.log('Server running on port 4000'); // sends message to the console upon running
});