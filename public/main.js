// define the HTML entry variables
let fname = document.getElementById('fname');
let lname = document.getElementById('lname');
let email = document.getElementById('email');
let password = document.getElementById('psw');
let role = document.getElementById('role');

// Function to get the selected role from radio buttons
function role() {
    const roleInputs = document.querySelectorAll('input[name="role"]');
    for (const input of roleInputs) {
        if (input.checked) {
            return (input.value)
        }
    }
}

// Assuming there's a form with id 'signupForm'
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Prepare the data to be sent
    const userData = {
        firstName: fname.value,
        lastName: lname.value,
        email: email.value,
        password: password.value,
        role: role() || 'customer'
    };

    // Send the data to the server
    fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Optionally, you can clear the form or show a success message
        document.getElementById('signupForm').reset();
        alert('Signup successful!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Signup failed. Please try again.');
    });
});