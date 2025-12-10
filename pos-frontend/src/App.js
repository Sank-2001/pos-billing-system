import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Customers from "./pages/customers";
import Products from "./pages/Products";
import Billing from "./pages/Billing";
import Invoice from "./pages/Invoice";
import OrdersList from "./pages/OrdersList";

function App() {
  return (
    <Router>
      <Sidebar />

      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<h1>Welcome to POS</h1>} />
          <Route path="/customers" element={<Customers />} />

          <Route path="/products" element={<Products />} />

          <Route path="/orders" element={<Billing />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/orders-list" element={<OrdersList />} />



        </Routes>
      </div>
    </Router>
  );
}

export default App;
