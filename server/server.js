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
  const data = req.body;
  
  function onSubmit() {
    // Gather input values
    const user = `${fname.value}, ${lname.value}, ${email.value}, ${password.value}, ${role.value}\n`;
    // import the append functionality from file system
    const fs = require('fs');

    // Append the data to the CSV files
    appendFile(user, users, (err) => {
      if (err) {
        console.error('Error writing to file', err)
      }
      else {
        console.log('User info successfully added')
      }
    })
  }


  res.send({ Success: 'This server is working' }) // sends message to the console of server running
})

app.listen(4000) // listens from port 4000
console.log('Server running') // sends message to the console upon running