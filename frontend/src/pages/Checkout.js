import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(c);
    setTotal(c.reduce((s, it) => s + it.price * (it.quantity || 1), 0));
  }, []);

  const createOrder = async () => {
    try {
      const payload = { cart: cart.map(i => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity || 1, size: i.size })), total };
      const res = await API.post("/orders", payload);
      const { orderId } = res.data;
      navigate(`/payment/${orderId}`);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create order");
    }
  };

  if (!cart.length) return <div>No items</div>;

  return (
    <div>
      <h3>Checkout</h3>
      <ul className="list-group mb-3">
        {cart.map((it, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
            <div>{it.name} — {it.size} x {it.quantity}</div>
            <div>${(it.price * (it.quantity || 1)).toFixed(2)}</div>
          </li>
        ))}
      </ul>
      <h4>Total: ${total.toFixed(2)}</h4>
      <button className="btn btn-success" onClick={createOrder}>Proceed to Payment</button>
    </div>
  );
}
