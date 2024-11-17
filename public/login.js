document.getElementById('loginBtn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const loginData = {
        email: document.getElementById('email').value,
        password: document.getElementById('psw').value,
    };

    // Send the data to the server
    fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.error || 'Network response was not ok');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message); // Handle success
            // Redirect or close modal here
            // document.getElementById("registered-modal").classList.add("hidden"); // Uncomment if you have a modal to close
            window.location = "./main.html"; // Redirect to main page
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Login failed: ' + error.message); // Show error message
        });
});