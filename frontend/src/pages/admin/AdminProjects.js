import React, { useEffect, useState } from "react";
import API from "../../api";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      if (image) fd.append("image", image);

      await API.post("/projects", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setDescription("");
      setImage(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Manage Projects</h3>

      <form onSubmit={createProject} className="mb-4">
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button className="btn btn-primary">Add Project</button>
      </form>

      <div className="row g-3">
        {projects.map((p) => (
          <div className="col-md-4" key={p.id}>
            <div className="card admin-card">
              <img
                src={`http://localhost:5000/uploads/projects/${p.image}`}
                className="card-img-top"
                style={{ height: 180 }}
                alt={p.title}
              />
              <div className="card-body">
                <h5>{p.title}</h5>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteProject(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
