import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center py-5">
      <h1 className="mb-3">Askar Stone</h1>
      <p className="lead mb-4">Premium stone materials for your spaces — browse our products and projects.</p>
      <div>
        <Link className="btn btn-primary me-2" to="/products">Shop Products</Link>
        <Link className="btn btn-outline-primary" to="/projects">Our Projects</Link>
      </div>
    </div>
  );
}
