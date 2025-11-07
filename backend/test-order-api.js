import fetch from 'node-fetch';

const testOrderAPI = async () => {
  const orderData = {
    "user": "69051fe9f2801c90712b1c26",
    "items": [
      {
        "product": "69051fe9f2801c90712b1c26",
        "name": "Demo Product",
        "quantity": 5,
        "price": 63
      }
    ],
    "totalAmount": 315,
    "status": "confirmed",
    "paymentMethod": "cash",
    "shippingAddress": {
      "name": "Testing User",
      "address": "123 Market Street",
      "city": "Delhi",
      "state": "DL",
      "postalCode": "110001",
      "country": "India"
    },
    "notes": "Testing order creation for Demo Product"
  };

  try {
    const response = await fetch('http://localhost:4000/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDUxZmU5ZjI4MDFjOTA3MTJiMWMwNiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzI3MzYwMDAsImV4cCI6MTc2NDI3MjAwMH0.example_token'
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testOrderAPI();