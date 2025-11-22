import React, { useEffect, useState } from "react";
import API from "../api";

export default function Projects() {
  const [projects,setProjects] = useState([]);

  useEffect(()=> {
    API.get("/projects").then(r => setProjects(r.data)).catch(e => console.error(e));
  }, []);

  return (
    <div>
      <h3>Projects</h3>
      <div className="row g-3">
        {projects.map(p => (
          <div className="col-md-4" key={p.id}>
            <div className="card admin-card">
        <img
  src={`http://localhost:5000/uploads/projects/${p.image}`}
  className="card-img-top"
  alt={p.title}
  style={{ height: 200, objectFit: "cover" }}
/>

              <div className="card-body">
                <h5>{p.title}</h5>
                <p className="text-truncate">{p.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
