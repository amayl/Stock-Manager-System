document.getElementById('addItemBtn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const productData = {
        itemName: document.getElementById('item-name').value,
        category: document.getElementById('category').value,
        quantity: document.getElementById('item-quantity').value,
        price: document.getElementById('price').value
    };

    // Send the data to the server
    fetch('http://localhost:4000/staff-view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.error || 'Network response was not ok');
                });
            }
            return response.json();
        })
});
