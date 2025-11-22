import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const removeItem = i => {
    const c = [...cart];
    c.splice(i, 1);
    setCart(c);
    localStorage.setItem("cart", JSON.stringify(c));
  };

  const total = cart.reduce((s, it) => s + it.price * (it.quantity || 1), 0);

  return (
    <div>
      <h3>Your Cart</h3>
      {cart.length === 0 ? <p>Cart is empty</p> : (
        <>
          <ul className="list-group mb-3">
            {cart.map((it, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img src={`http://localhost:5000/uploads/products/${it.image}`} alt="" width="70" className="me-3" />
                  <div>
                    <div><strong>{it.name}</strong></div>
                    <div className="text-muted">{it.size} • Qty: {it.quantity}</div>
                  </div>
                </div>
                <div>
                  ${ (it.price * (it.quantity || 1)).toFixed(2) }
                  <button className="btn btn-sm btn-outline-danger ms-3" onClick={() => removeItem(idx)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between align-items-center">
            <h4>Total: ${total.toFixed(2)}</h4>
            <div>
              <button className="btn btn-outline-secondary me-2" onClick={() => navigate(-1)}>Continue Shopping</button>
              <button className="btn btn-primary" onClick={() => navigate("/checkout")}>Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
