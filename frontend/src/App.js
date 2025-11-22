import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentMock from "./pages/PaymentMock";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMessages from "./pages/admin/AdminMessages";
import Footer from "./components/Footer";


function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}


function LayoutWithFooter({ children }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  return (
    <>
      {children}
      {!isAdminPage && <Footer />} 
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, []);

  return (
    <BrowserRouter>
      <LayoutWithFooter>
        <Navbar user={user} setUser={setUser} />
        <div className="container mt-4 mb-5">
          <Routes>
           
            <Route
              path="/"
              element={user?.is_admin ? <Navigate to="/admin" /> : <Home />}
            />

          
            <Route path="/products" element={<Products />} />
            <Route
              path="/product/:id"
              element={
                <RequireAuth>
                  <ProductDetail />
                </RequireAuth>
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <Checkout />
                </RequireAuth>
              }
            />
            <Route
              path="/payment/:orderId"
              element={
                <RequireAuth>
                  <PaymentMock />
                </RequireAuth>
              }
            />
            <Route path="/projects" element={<Projects />} />
            <Route
              path="/contact"
              element={
                <RequireAuth>
                  <Contact />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />

           
            <Route
              path="/admin"
              element={
                user && user.is_admin ? <AdminDashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/admin/products"
              element={
                user && user.is_admin ? <AdminProducts /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/admin/projects"
              element={
                user && user.is_admin ? <AdminProjects /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/admin/orders"
              element={
                user && user.is_admin ? <AdminOrders /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/admin/messages"
              element={
                user && user.is_admin ? <AdminMessages /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
      </LayoutWithFooter>
    </BrowserRouter>
  );
}
