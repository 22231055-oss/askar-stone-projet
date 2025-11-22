import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    API.get("/products").then(r => setProducts(r.data)).catch(e => console.error(e));
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Products</h3>
        <input className="form-control w-50" placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <div className="row g-3">
        {filtered.map(p => (
          <div key={p.id} className="col-md-4">
            <div className="card admin-card h-100">
              <img src={`http://localhost:5000/uploads/products/${p.variants[0]?.image || ""}`} className="card-img-top" alt={p.name} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text text-truncate">{p.description}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <small className="text-muted">{p.variants.length} sizes</small>
                  <Link className="btn btn-primary btn-sm" to={`/product/${p.id}`}>View</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

