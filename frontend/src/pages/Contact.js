import React, { useState } from "react";
import API from "../api";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  const send = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("message", message);
      if (image) fd.append("image", image);
      await API.post("/messages", fd, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Message sent");
      setMessage(""); setImage(null);
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  return (
    <div>
      <h3>Contact</h3>
      <form onSubmit={send}>
        <textarea className="form-control mb-2" rows="4" placeholder="Your message" value={message} onChange={e=>setMessage(e.target.value)} required />
        <input className="form-control mb-2" type="file" onChange={e=>setImage(e.target.files[0])} />
        <button className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}
