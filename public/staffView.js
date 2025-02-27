document.addEventListener("DOMContentLoaded", function () {
  // Fetch products from the database when the page loads
  fetch("http://localhost:4000/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((products) => {
      const table = document.getElementById("inventory-list");
      products.forEach((product) => {
        addRowToTable(product);
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
});

function addRowToTable(product) {
  const table = document.getElementById("inventory-list");
  const newRow = table.insertRow();
  const cell1 = newRow.insertCell(0);
  const cell2 = newRow.insertCell(1);
  const cell3 = newRow.insertCell(2);
  const cell4 = newRow.insertCell(3);
  const cell5 = newRow.insertCell(4); // For Edit button
  const cell6 = newRow.insertCell(5); // For Delete button

  // Add the values to the cells
  cell1.textContent = product.name;
  cell2.textContent = product.category;
  cell3.textContent = product.quantity;
  cell4.textContent = product.price;

  // Create Edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.onclick = function () {
    editItem(product);
  };
  cell5.appendChild(editButton);

  // Create Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function () {
    deleteItem(product.id, newRow);
  };
  cell6.appendChild(deleteButton);
}

function editItem(product) {
  // Populate the form with the product details
  document.getElementById("item-name").value = product.name;
  document.getElementById("category").value = product.category;
  document.getElementById("item-quantity").value = product.quantity;
  document.getElementById("price").value = product.price;

  //store the product ID in a hidden input field to use it for updating
  document.getElementById("inventory-form").dataset.editingId = product.id;
}

function deleteItem(productId, row) {
  // Send a request to delete the item from the server
  fetch(`http://localhost:4000/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Remove the row from the table
      row.remove();
    })
    .catch((error) => {
      console.error("Error deleting item:", error);
    });
}

document
  .getElementById("inventory-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the values from the form
    const itemName = document.getElementById("item-name").value;
    const category = document.getElementById("category").value;
    const quantity = parseInt(
      document.getElementById("item-quantity").value,
      10
    ); // Convert to integer
    const price = parseFloat(document.getElementById("price").value); // Convert to float

    // Check if we are editing an existing item
    const editingId =
      document.getElementById("inventory-form").dataset.editingId;

    if (editingId) {
      // Update existing item
      const productData = {
        name: itemName,
        category: category,
        quantity: quantity,
        price: price,
      };

      fetch(`http://localhost:4000/products/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Update the row in the table
          const row = document.querySelector(`tr[data-id="${editingId}"]`);
          row.cells[0].textContent = itemName;
          row.cells[1].textContent = category;
          row.cells[2].textContent = quantity;
          row.cells[3].textContent = price;

          // Clear the form and remove editing ID
          document.getElementById("inventory-form").reset();
          delete document.getElementById("inventory-form").dataset.editingId;
        })
        .catch((error) => {
          console.error("Error updating item:", error);
        });
    } else {
      // Create a new row and cells
      const table = document.getElementById("inventory-list");
      const newRow = table.insertRow();

      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      const cell3 = newRow.insertCell(2);
      const cell4 = newRow.insertCell(3);
      const cell5 = newRow.insertCell(4); // For Edit button
      const cell6 = newRow.insertCell(5); // For Delete button

      // Add the values to the cells
      cell1.textContent = itemName;
      cell2.textContent = category;
      cell3.textContent = quantity;
      cell4.textContent = price;

      // Create Edit button
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.onclick = function () {
        editItem({
          id: newRow.dataset.id,
          name: itemName,
          category,
          quantity,
          price,
        });
      };
      cell5.appendChild(editButton);

      // Create Delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = function () {
        deleteItem(newRow.dataset.id, newRow);
      };
      cell6.appendChild(deleteButton);

      // Clear the form fields
      document.getElementById("inventory-form").reset();

      // Send the data to the server
      const productData = {
        name: itemName,
        category: category,
        quantity: quantity,
        price: price,
      };

      fetch("http://localhost:4000/staff-view", {
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
          // Optionally, you can store the new product ID in the row
          newRow.dataset.id = data.id; // Assuming the server returns the new product ID
        })
        .catch((error) => {
          console.error("Error:", error);
          // Optionally, display an error message to the user
        });
    }
  });
