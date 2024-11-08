// Assuming this is part of your existing client-side JavaScript
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const userData = {
        fname: document.getElementById('fname').value,
        lname: document.getElementById('lname').value,
        email: document.getElementById('email').value,
        password: document.getElementById('psw').value,
        role: document.querySelector('input[name="role"]:checked').value // Get selected role
    };

    if ((userData.role == 'manager' || userData.role == 'owner') && userData.email.includes('@ntshfoods.com') == false) {
        throw new Error('Ensure correct email has been used for selected role')
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
        console.log(data.message); // Handle success
        alert(data.message); // Show success message
        document.getElementById('signupForm').reset(); // Reset form after submission
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Signup failed. Please try again.');
    });
});