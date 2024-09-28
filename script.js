// Assign the id="" variables to JS variables
let signupBtn = document.getElementById("signupBtn");
let loginBtn = document.getElementById("loginBtn");
let nameField = document.getElementById("nameField");
let title = document.getElementById("title");

loginBtn.onclick = function() {
    nameField.style.maxHeight = "0"; // gets rid of the name field
    title.innerHTML = "Login"; // changes the title from 'Sign Up' to 'Login'
    signupBtn.classList.add("disable"); // unhighlights the signup button
    loginBtn.classList.remove("disable") // highlights the login button
}


signupBtn.onclick = function() {
    nameField.style.maxHeight = "60px"; // adds the name field
    title.innerHTML = "Sign Up"; // changes the title from 'Login' to 'Sign Up'
    signupBtn.classList.remove("disable"); // highlights the signup button
    loginBtn.classList.add("disable") // unhighlights the signup button
}