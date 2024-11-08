const express = require('express'); // import express for the app
const cors = require('cors');
const fs = require('fs'); // Import the fs module to handle file operations
const app = express(); // app instance (server object)

// define the CSV file variable
let users = '/Users/amayl/Desktop/Computer Science/compsci things/github repositories /A Level Computer Science NEA/stock-management-system/database/users.csv';

// Middleware
app.use(cors()); // allow all origins
app.use(express.json()); // to parse the JSON body

// sends 'Pong' if successful connection
app.get('/ping', (req, res) => res.send('Pong'));

// Handle signup
app.post('/signup', (req, res) => {
    const { fname, lname, email, password, role } = req.body;

    // Prepare user data for CSV
    const user = `${fname},${lname},${email},${password},${role}\n`;

    // Append user data to the CSV file
    fs.appendFile(users, user, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).send({ error: 'Failed to save user' });
        }
        else if ((role == 'manager' || role == 'owner') && (email.includes('@ntshfoods.com') == false )) {
            console.error('Error - Please enter a valid email address', err);
            return res.status(401).send({ error: 'Ensure correct email has been used for selected role'})
        }
        else {
            console.log('User  info successfully added');
            return res.status(201).send({ message: 'User registered successfully' });
        };
    });
});

// Start the server
app.listen(4000, () => {
    console.log('Server running on port 4000'); // sends message to the console upon running
});

