document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  const loginData = {
    email: document.getElementById("email").value,
    password: document.getElementById("psw").value,
  };

  // Send the data to the server
  fetch("http://localhost:4000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
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
      if (loginData.email.includes("@ntshfoods.com")) {
        // check if the email is a staff email
        window.location = "./staff-view.html"; // Redirect to staff page
      } else {
        // redirect to customer page if staff email not entered
        window.location = "./customer-view.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Login failed: " + error.message); // Show error message
    });
});
