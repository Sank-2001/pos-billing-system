// src/pages/Invoice.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import API from "../api";   // ⬅️ NEW import

const SHOP_NAME = "Sanket Super Mart";
const SHOP_GSTIN = "22ABCDE1234F1Z5"; // replace if different
const UPI_ID = "sanketavinash5982-1@okhdfcbank";
const SIGNATURE_NAME = "Sanket Chandge";

function formatInvoiceNumber(orderId) {
  const padded = String(orderId).padStart(3, "0");
  return `POS-2025-INV-${padded}`;
}

function Invoice() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    loadOrder();
    loadItems();
    loadProducts();
  }, []);

  useEffect(() => {
    if (order) generateUpiQr();
  }, [order]);

  const loadOrder = async () => {
    const res = await axios.get(`${API}/api/orders/${id}`);
    setOrder(res.data);

    const cust = await axios.get(
      `${API}/api/customers/${res.data.customer.id}`
    );
    setCustomer(cust.data);
  };

  const loadItems = async () => {
    const res = await axios.get(`${API}/api/order-items/${id}`);
    setItems(res.data);
  };

  const loadProducts = async () => {
    const res = await axios.get(`${API}/api/products`);
    setProducts(res.data);
  };

  const getProductName = (pid) => {
    const p = products.find((p) => p.id === pid);
    return p ? p.name : "";
  };

  const generateUpiString = () => {
    return `upi://pay?pa=${encodeURIComponent(
      UPI_ID
    )}&pn=${encodeURIComponent(SHOP_NAME)}&cu=INR`;
  };

  const generateUpiQr = async () => {
    try {
      const upi = generateUpiString();
      const dataUrl = await QRCode.toDataURL(upi, { margin: 2, scale: 6 });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("QR generation failed", err);
    }
  };

  const downloadPDF = () => {
    const invoiceElement = document.getElementById("invoiceDiv");
    invoiceElement.style.background = "white";

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const invNumber = formatInvoiceNumber(order.id);
      pdf.save(`${invNumber}.pdf`);
    });
  };

  if (!order || !customer) return <h2>Loading Invoice...</h2>;

  const subtotal = order.totalAmount || 0;
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const finalTotal = subtotal + cgst + sgst;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <button
          onClick={downloadPDF}
          style={{
            padding: "10px 16px",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          Download PDF
        </button>
      </div>

      <button
        onClick={() => window.print()}
        style={{
          padding: "10px 16px",
          background: "#fff",
          color: "#111827",
          border: "1px solid #111827",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 15,
          marginLeft: 8,
        }}
      >
        Print Invoice
      </button>

      {/* ...rest of your JSX unchanged... */}
      {/* (everything below this line can stay exactly as you had it) */}
      {/* I left the long JSX untouched since it doesn't call the backend */}
      {/*
         [The rest of your component body from <div id="invoiceDiv"...> downwards
          stays exactly the same as in your original file]
      */}
    </div>
  );
}

export default Invoice;
