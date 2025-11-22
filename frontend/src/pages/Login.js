import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (setUser) setUser(res.data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{maxWidth:480}} className="mx-auto">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="form-control mb-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}
