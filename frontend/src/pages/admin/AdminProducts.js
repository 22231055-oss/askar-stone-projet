import React, { useEffect, useState } from "react";
import API from "../../api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState([{ id: null, size: "", price: "", image: null }]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  const addVariantRow = () =>
    setVariants([...variants, { id: null, size: "", price: "", image: null }]);

  const setVariant = (i, field, value) => {
    const copy = [...variants];
    copy[i][field] = value;
    setVariants(copy);
  };

  const removeVariant = (i) => {
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setVariants(
      product.variants.map((v) => ({
        id: v.id,
        size: v.size,
        price: v.price,
        image: null,
      }))
    );
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setVariants([{ id: null, size: "", price: "", image: null }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      fd.append(
        "variants",
        JSON.stringify(
          variants.map((v) => ({
            id: v.id,
            size: v.size,
            price: v.price,
          }))
        )
      );
      variants.forEach((v) => {
        if (v.image) fd.append("images", v.image);
      });

      if (editingProduct) {
        await API.put(`/products/${editingProduct.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Product updated");
      } else {
        await API.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Product created");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Failed to submit product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err);
      alert("❌ Failed to delete product");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-3">{editingProduct ? "Edit Product" : "Create Product"}</h3>
      <form onSubmit={handleSubmit} className="mb-5 border p-3 rounded bg-light shadow-sm">
        <input
          className="form-control mb-2"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <h6>Variants</h6>
        {variants.map((v, i) => (
          <div key={i} className="border p-2 mb-2 rounded d-flex align-items-end gap-2 flex-wrap">
            <input
              className="form-control mb-1"
              placeholder="Size"
              value={v.size}
              onChange={(e) => setVariant(i, "size", e.target.value)}
              required
            />
            <input
              className="form-control mb-1"
              placeholder="Price"
              type="number"
              value={v.price}
              onChange={(e) => setVariant(i, "price", e.target.value)}
              required
            />
            <input
              className="form-control mb-1"
              type="file"
              onChange={(e) => setVariant(i, "image", e.target.files[0])}
            />
            <button
              type="button"
              className="btn btn-danger btn-sm mb-1"
              onClick={() => removeVariant(i)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-2" onClick={addVariantRow}>
          + Add Variant
        </button>
        <div>
          <button className="btn btn-primary me-2" type="submit">
            {editingProduct ? "Update Product" : "Create Product"}
          </button>
          {editingProduct && (
            <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h5>Existing Products</h5>
      <table className="table table-striped table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Variants</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>
                {p.variants.map((v, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-2 mb-1">
                    {v.imageUrl && (
                      <img
                        src={v.imageUrl}
                        alt={v.size}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                    <span>{`${v.size} ($${v.price})`}</span>
                  </div>
                ))}
              </td>
              <td className="d-flex gap-2">
                <button className="btn btn-sm btn-warning" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
