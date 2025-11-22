import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function PaymentMock() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    setLoading(true);
    try {
      const res = await API.post("/pay", { orderId });
      alert("Payment success: " + res.data.transactionId);
      localStorage.removeItem("cart");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Mock Payment</h3>
      <p>Order ID: {orderId}</p>
      <button className="btn btn-primary" onClick={pay} disabled={loading}>{loading ? "Processing..." : "Pay Now"}</button>
    </div>
  );
}
