// Test order creation API
const testOrder = {
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

console.log('Test Order Payload:', JSON.stringify(testOrder, null, 2));