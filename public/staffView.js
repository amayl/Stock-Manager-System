document
  .getElementById("inventory-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the values from the form
    const itemName = document.getElementById("item-name").value;
    const category = document.getElementById("category").value;
    const quantity = document.getElementById("item-quantity").value;
    const price = document.getElementById("price").value;

    // Create a new row and cells
    const table = document.getElementById("inventory-list");
    const newRow = table.insertRow();

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);

    // Add the values to the cells
    cell1.textContent = itemName;
    cell2.textContent = category;
    cell3.textContent = quantity;
    cell4.textContent = price;

    // Clear the form fields
    document.getElementById("inventory-form").reset();

    // Send the data to the server
    const productData = {
      itemName: itemName,
      category: category,
      quantity: quantity,
      price: price,
    };

    fetch("http://localhost:3000/staff-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
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
        console.log("Success: ", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
