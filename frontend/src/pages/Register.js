import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { name, email, password });
      alert("Registered — please login");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div style={{maxWidth:480}} className="mx-auto">
      <h3>Register</h3>
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="form-control mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="form-control mb-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}
