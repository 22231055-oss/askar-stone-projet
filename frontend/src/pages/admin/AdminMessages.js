import React, { useEffect, useState } from "react";
import API from "../../api";

export default function AdminMessages() {
  const [messages,setMessages] = useState([]);
  const [q,setQ] = useState("");

  useEffect(()=> { fetch(); }, []);
  const fetch = async () => { const r = await API.get("/messages"); setMessages(r.data); };

  const filtered = messages.filter(m => (m.user_name || "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <h3>Messages</h3>
      <input className="form-control mb-3" placeholder="Search by user" value={q} onChange={e=>setQ(e.target.value)} />
      {filtered.map(m => (
        <div key={m.id} className="card mb-2 p-2">
          <div><strong>{m.user_name}</strong> <small className="text-muted">{new Date(m.created_at).toLocaleString()}</small></div>
          <div>{m.message}</div>
          {m.image && <img src={`http://localhost:5000/uploads/contact/${m.image}`} width="120" className="mt-2" alt="" />}
        </div>
      ))}
    </div>
  );
}
