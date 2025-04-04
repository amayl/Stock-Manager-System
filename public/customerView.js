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

  // Add the values to the cells
  cell1.textContent = product.name;
  cell2.textContent = product.category;
  cell3.textContent = product.quantity;
  cell4.textContent = product.price;
}

document.getElementById("viewStatsBtn").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:4000/statistics");
    const data = await response.json();

    // Display statistics
    document.getElementById(
      "totalItems"
    ).innerText = `Total Items: ${data.totalItems}`;
    document.getElementById(
      "totalQuantity"
    ).innerText = `Total Quantity: ${data.totalQuantity}`;
    document.getElementById(
      "totalValue"
    ).innerText = `Total Value: £${data.totalValue.toFixed(2)}`;

    // Display category breakdown
    const categoryList = document.getElementById("categoryBreakdown");
    categoryList.innerHTML = ""; // Clear previous data
    for (const [category, count] of Object.entries(data.categoryBreakdown)) {
      const li = document.createElement("li");
      li.innerText = `${category}: ${count}`;
      categoryList.appendChild(li);
    }

    // Show the statistics section
    document.getElementById("statistics").style.display = "block";
  } catch (error) {
    console.error("Error fetching statistics:", error);
    alert("Failed to fetch statistics.");
  }
});

document.getElementById("lowStockBtn").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:4000/low-stock");
    const data = await response.json();

    const lowStockList = document.getElementById("lowStockList");
    lowStockList.innerHTML = ""; // Clear previous data

    if (data.message) {
      lowStockList.innerText = data.message; // Display message if no low stock products
    } else {
      data.forEach((product) => {
        const li = document.createElement("li");
        li.innerText = `${product.name} - Quantity: ${product.quantity}`;
        lowStockList.appendChild(li);
      });
    }
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    alert("Failed to fetch low stock products.");
  }
});
