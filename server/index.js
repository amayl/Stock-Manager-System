const express = require('express') // import express for the app thingy
const cors = require('cors')
const app = express() // app thingy in question (server object)

// Middleware
// stuff that runs before the request is handled
app.use(cors()) // allow all ports
app.use(express.json()) // to parse the JSON body

app.get('/ping', (req, res) => res.send('Pong'))

app.post('/signup', (req, res) => {
  const data = req.body;


  res.send({ hello: 'world' })
})

app.listen(4000)
console.log('Server running')