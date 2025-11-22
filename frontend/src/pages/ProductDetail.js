import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [variant, setVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    API.get(`/products/${id}`).then(r => {
      setProduct(r.data);
      setVariant(r.data.variants?.[0] || null);
    }).catch(() => navigate("/products"));
  }, [id, navigate]);

  const addToCart = () => {
    if (!variant) return alert("Select a size");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      size: variant.size,
      price: parseFloat(variant.price),
      image: variant.image,
      quantity: quantity || 1
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
    navigate("/cart");
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="row g-4">
      <div className="col-md-6">
        <img src={`http://localhost:5000/uploads/products/${variant?.image || ""}`} alt={product.name} className="product-image" />
      </div>
      <div className="col-md-6">
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="mb-3">
          <label className="form-label">Size & Price</label>
          <select className="form-select variant-select" value={variant?.id || ""} onChange={e => {
            const v = product.variants.find(x => x.id === parseInt(e.target.value));
            setVariant(v);
          }}>
            {product.variants.map(v => <option key={v.id} value={v.id}>{v.size} — ${v.price}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input type="number" className="form-control w-25" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} />
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={addToCart}>Add to Cart</button>
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
}
