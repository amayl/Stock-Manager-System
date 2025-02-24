document
  .getElementById("signupBtn")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const userData = {
      fname: document.getElementById("fname").value,
      lname: document.getElementById("lname").value,
      email: document.getElementById("email").value,
      password: document.getElementById("psw").value,
      role: document.querySelector('input[name="role"]:checked').value, // Get selected role
    };

    // Validate email for specific roles
    if (
      (userData.role === "manager" || userData.role === "owner") &&
      !userData.email.includes("@ntshfoods.com")
    ) {
      alert("Ensure correct email has been used for selected role");
      return; // Exit the function if validation fails
    }

    // Send the data to the server
    fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            throw new Error(errData.error || "Network response was not ok");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message); // Handle success
        // Add this event listener to close the modal
        document
          .getElementById("proceedBtn")
          .addEventListener("click", function () {
            // document.getElementById("registered-modal").classList.add("hidden");
            window.location = "./login.html";
          });
        document.getElementById("registered-modal").classList.remove("hidden");
        // document.getElementById('signupForm').reset(); // Reset form after submission
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Signup failed: " + error.message); // Show error message
      });
  });
