import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function OrdersList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Invoices</h2>

      <table border="1" cellPadding="10" style={{ width: "60%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Date</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer?.name}</td>
              <td>₹{o.totalAmount}</td>
              <td>{o.orderDate}</td>
              <td>
                <Link to={`/invoice/${o.id}`}>Open Invoice</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersList;
