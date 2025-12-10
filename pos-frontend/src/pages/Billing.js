import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";   // ⬅️ NEW import

function Billing() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);

  const loadProducts = async () => {
    const res = await axios.get(`${API}/api/products`);
    setProducts(res.data);
  };

  const loadCustomers = async () => {
    const res = await axios.get(`${API}/api/customers`);
    setCustomers(res.data);
  };

  const addToCart = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = products.find((p) => p.id == selectedProduct);

    const item = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      total: product.price * quantity,
    };

    setCart([...cart, item]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  const saveOrder = async () => {
    const orderData = {
      customerId: selectedCustomer,
      totalAmount: totalAmount,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    const res = await axios.post(`${API}/api/orders`, orderData);
    alert("Order Saved! Order ID: " + res.data.orderId);

    setCart([]);
    setSelectedCustomer("");
  };

  return (
    <div>
      <h2>Billing</h2>

      {/* Customer Select */}
      <select
        value={selectedCustomer}
        onChange={(e) => setSelectedCustomer(e.target.value)}
      >
        <option value="">Select Customer</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Product Select */}
      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} - ₹{p.price}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Qty"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <button onClick={addToCart}>Add</button>

      {/* CART TABLE */}
      <h3>Cart Items</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>₹{item.price}</td>
              <td>{item.quantity}</td>
              <td>₹{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Grand Total: ₹{totalAmount}</h3>

      <button
        onClick={saveOrder}
        disabled={!selectedCustomer || cart.length === 0}
      >
        Save Order
      </button>
    </div>
  );
}

export default Billing;
