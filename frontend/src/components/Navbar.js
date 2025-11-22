import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }
  }, [user, setUser]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" style={{ cursor: "pointer" }} to="/">
          Askar Stone
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* ✅ الزائر أو المستخدم العادي */}
            {(!user || (user && !user.is_admin)) && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/projects">Projects</Link></li>
                {user && (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/cart">Cart</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
                  </>
                )}
              </>
            )}

            {/* ✅ الأدمن فقط */}
            {user && user.is_admin === 1 && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/products">Manage Products</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/projects">Manage Projects</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/messages">Messages</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/orders">Orders</Link></li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item pe-3">
                  <span className="nav-link">Hi, {user.name}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item pe-2">
                  <Link className="btn btn-outline-light" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
