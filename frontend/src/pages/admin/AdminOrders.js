import React, { useEffect, useState } from "react";
import API from "../../api";

export default function AdminOrders() {
  const [orders,setOrders] = useState([]);
  const [q,setQ] = useState("");

  useEffect(()=> { fetch(); }, []);
  const fetch = async () => { const r = await API.get("/orders"); setOrders(r.data); };

  const markPaid = async (id) => {
    await API.post(`/orders/${id}/mark-paid`);
    fetch();
  };

  const filtered = orders.filter(o => (o.user_name || "").toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <h3>Orders</h3>
      <input className="form-control mb-3" placeholder="Search by user" value={q} onChange={e=>setQ(e.target.value)} />
      {filtered.map(o => (
        <div key={o.id} className="card mb-2 p-2">
          <div className="d-flex justify-content-between">
            <div><strong>#{o.id}</strong> — {o.user_name} — ${o.total} — <span className={o.status==='paid'?'badge badge-paid':'badge badge-unpaid'}>{o.status}</span></div>
            {o.status !== 'paid' && <button className="btn btn-sm btn-success" onClick={()=>markPaid(o.id)}>Mark Paid</button>}
          </div>
          <div className="mt-2">
            {o.items?.map(it=>(
              <div key={it.id} className="d-flex align-items-center mb-2">
                <img src={`http://localhost:5000/uploads/products/${it.variant_image}`} width="70" className="me-2" alt="" />
                <div>{it.product_name} — {it.variant_size} x {it.quantity} — ${it.variant_price}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
