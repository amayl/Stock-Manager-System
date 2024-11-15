const express = require('express'); // import express for the app
const cors = require('cors');
const mongoose = require('mongoose'); // mongodb import
const app = express(); // app instance (server object)
const path = require('path');
const bcrypt = require('bcrypt');

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

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    userPassword: String // Renamed to userPassword for clarity
});

const Users = mongoose.model('Users', userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/signup', async (req, res) => {
    const { fname, lname, email, password } = req.body;

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(saltRounds); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

        // Create a new user instance with the hashed password
        const user = new Users({
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