import React, { useEffect, useState } from "react";
import axios from "axios";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // Load all customers
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const res = await axios.get("http://localhost:8080/api/customers");
    setCustomers(res.data);
  };

  // Add Customer
  const saveCustomer = async () => {
    await axios.post("http://localhost:8080/api/customers", form);
    setForm({ name: "", email: "", phone: "", address: "" });
    loadCustomers();
  };

  return (
    <div>
      <h2>Customers</h2>

      {/* Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <button onClick={saveCustomer}>Add Customer</button>
      </div>

      {/* Table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
