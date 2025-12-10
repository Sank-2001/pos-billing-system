// src/pages/Invoice.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

const SHOP_NAME = "Sanket Super Mart";
const SHOP_GSTIN = "22ABCDE1234F1Z5"; // replace if different
const UPI_ID = "sanketavinash5982-1@okhdfcbank";
const SIGNATURE_NAME = "Sanket Chandge";

function formatInvoiceNumber(orderId) {
  // POS-2025-INV-001 style
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
    const res = await axios.get("http://localhost:8080/api/orders/" + id);
    setOrder(res.data);

    const cust = await axios.get(
      "http://localhost:8080/api/customers/" + res.data.customer.id
    );

    setCustomer(cust.data);
  };

  const loadItems = async () => {
    const res = await axios.get("http://localhost:8080/api/order-items/" + id);
    setItems(res.data);
  };

  const loadProducts = async () => {
    const res = await axios.get("http://localhost:8080/api/products");
    setProducts(res.data);
  };

  const getProductName = (pid) => {
    const p = products.find((p) => p.id === pid);

    return p ? p.name : "";
  };

  const generateUpiString = () => {
    // UPI deep link; merchant name included
    // amount omitted so scanner can enter (or you can include &am=... to prefill)
    return `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
      SHOP_NAME
    )}&cu=INR`;
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
    // ensure background white for canvas
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

  // Tax calculation (example CGST+SGST 9% each)
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

      <div
        id="invoiceDiv"
        style={{
          width: 760,
          margin: "0 auto",
          padding: 28,
          background: "white",
          borderRadius: 10,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#111827",
        }}
      >
        {/* Top header */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <img
              src="/logo.png"
              alt="logo"
              style={{
                width: 84,
                height: 84,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
              }}
            />
            <div>
              <h1 style={{ margin: 0 }}>{SHOP_NAME}</h1>
              <div style={{ color: "#374151", marginTop: 4, fontSize: 13 }}>
                <div>GSTIN: {SHOP_GSTIN}</div>
                <div>Address line 1, City</div>
                <div>Phone: +91 9876543210</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                background: "#111827",
                color: "white",
                padding: "10px 14px",
                borderRadius: 6,
                display: "inline-block",
              }}
            >
              <div style={{ fontSize: 14 }}>TAX INVOICE</div>
              <div style={{ marginTop: 6, fontSize: 12 }}>
                {formatInvoiceNumber(order.id)}
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: "#374151" }}>
              <div>Date: {new Date(order.orderDate).toLocaleString()}</div>
              <div>Invoice ID: {order.id}</div>
            </div>
          </div>
        </div>

        <hr style={{ margin: "18px 0", borderColor: "#e6e6e6" }} />

        {/* Bill to / invoice info */}
        <div style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              flex: 1,
              background: "#f3f4f6",
              padding: 12,
              borderRadius: 6,
            }}
          >
            <div style={{ fontSize: 13, color: "#6b7280" }}>Bill To</div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{customer.name}</div>
            <div style={{ color: "#374151", marginTop: 6, fontSize: 13 }}>
              <div>{customer.address}</div>
              <div>Email: {customer.email}</div>
              <div>Phone: {customer.phone}</div>
            </div>
          </div>

          <div
            style={{
              width: 260,
              background: "#f3f4f6",
              padding: 12,
              borderRadius: 6,
            }}
          >
            <div style={{ fontSize: 13, color: "#6b7280" }}>Payment</div>
            <div style={{ marginTop: 8, fontSize: 14 }}>
              <div>Mode: Cash</div>
              <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
            </div>

            {/* QR */}
            <div style={{ marginTop: 12, textAlign: "center" }}>
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="UPI QR" style={{ width: 120 }} />
              ) : (
                <div style={{ color: "#9ca3af" }}>Generating QR…</div>
              )}
              <div style={{ fontSize: 12, color: "#374151", marginTop: 6 }}>
                Scan to Pay (UPI)
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{UPI_ID}</div>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div style={{ marginTop: 18 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#111827", color: "#fff" }}>
                <th style={{ padding: 10, textAlign: "left" }}>Item</th>
                <th style={{ padding: 10, width: 80 }}>HSN</th>
                <th style={{ padding: 10, width: 90, textAlign: "right" }}>
                  Price
                </th>
                <th style={{ padding: 10, width: 60, textAlign: "center" }}>
                  Qty
                </th>
                <th style={{ padding: 10, width: 110, textAlign: "right" }}>
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => (
                <tr key={it.id} style={{ borderBottom: "1px solid #e6e6e6" }}>
                  <td style={{ padding: 10 }}>
                    {getProductName(it.product.id)}
                  </td>
                  <td style={{ padding: 10, textAlign: "center" }}>1001</td>
                  <td style={{ padding: 10, textAlign: "right" }}>
                    ₹{it.price.toFixed(2)}
                  </td>
                  <td style={{ padding: 10, textAlign: "center" }}>
                    {it.quantity}
                  </td>
                  <td style={{ padding: 10, textAlign: "right" }}>
                    ₹{(it.price * it.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* totals */}
        <div
          style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}
        >
          <div
            style={{
              width: 320,
              background: "#f3f4f6",
              padding: 12,
              borderRadius: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Subtotal</div>
              <div>₹{subtotal.toFixed(2)}</div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              <div>CGST (9%)</div>
              <div>₹{cgst.toFixed(2)}</div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              <div>SGST (9%)</div>
              <div>₹{sgst.toFixed(2)}</div>
            </div>

            <hr style={{ margin: "10px 0", borderColor: "#e6e6e6" }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              <div>Grand Total</div>
              <div>₹{finalTotal.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "#6b7280" }}>
            <div>This is a computer generated invoice.</div>
            <div>Goods once sold will not be taken back.</div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700 }}>{SIGNATURE_NAME}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
