const express = require('express') // import express for the app thingy
const cors = require('cors');
const app = express() // app thingy in question (server object)

// define the CSV file variables
let users = 'users.csv';
let products = 'products.csv';
let inventory = 'inventory.csv';

// Middleware
// stuff that runs before the request is handled
app.use(cors()) // allow all ports
app.use(express.json()) // to parse the JSON body

// sends 'Pong' if successful connection
app.get('/ping', (req, res) => res.send('Pong'))


app.post('/signup', (req, res) => {
  const { fname, lname, email, password, role } = req.body;

  const user = `${fname}, ${lname}, ${email}, ${password}, ${role}\n`;

  fs.appendFile(users, user, (err) => {
    if (err) {
      console.error('Error writing to file', err);
      return res.status(500).send({ error: 'Failed to save user' });
    } else {
      console.log('User  info successfully added');
      return res.status(201).send({ message: 'User  registered successfully' });
    }
  });
});

app.listen(4000) // listens from port 4000
console.log('Server running') // sends message to the console upon running

