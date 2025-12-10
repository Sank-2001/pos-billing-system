import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">POS</h2>

      <ul>
        <li><Link to="/customers">Customers</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/orders">Billing</Link></li>
        <li><Link to="/orders-list">Invoices</Link></li>

      </ul>
    </div>
  );
}

export default Sidebar;
