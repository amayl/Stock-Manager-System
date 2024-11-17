const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    userPassword: String // Renamed to userPassword for clarity
});

const loginSchema = new mongoose.Schema({
    email: String,
    userPassword: String
});

const userCollection = mongoose.model('Users', userSchema);
module.exports = userCollection