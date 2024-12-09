"use client"; // Asegura que el código se ejecute solo en el cliente

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ActualizarProyecto() {
  const [projects, setProjects] = useState([]);  // Proyectos disponibles
  const [selectedProject, setSelectedProject] = useState(null);  // Proyecto seleccionado
  const [formData, setFormData] = useState({
    name: "",
    projectCode: "",
    email: "",
    internalCode: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Obtener la lista de proyectos
  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("jwt");

      if (!token) {
        setMessage("Por favor, inicia sesión primero.");
        return;
      }

      try {
        const response = await fetch("https://bildy-rpmaya.koyeb.app/api/project", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          setMessage(data.message || "No se pudo obtener los proyectos.");
          return;
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        setMessage("Error al cargar los proyectos.");
        console.error("Error:", error);
      }
    };

    fetchProjects();
  }, []);

  // Cargar los detalles del proyecto seleccionado
  const handleProjectSelect = async (projectId) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setMessage("Por favor, inicia sesión primero.");
      return;
    }

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/one/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.message || "No se pudo obtener los detalles del proyecto.");
        return;
      }

      const data = await response.json();
      setSelectedProject(data._id);
      setFormData({
        name: data.name,
        projectCode: data.projectCode,
        email: data.email,
        internalCode: data.code,
      });
    } catch (error) {
      setMessage("Error al cargar los detalles del proyecto.");
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("jwt");

    if (!formData.name || !formData.projectCode || !formData.email || !formData.internalCode) {
      setMessage("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${selectedProject}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Proyecto actualizado con éxito.");
        router.push("/proyectos");  // Redirige a la página de proyectos
      } else {
        const data = await response.json();
        setMessage(data.message || "Hubo un error al actualizar el proyecto.");
      }
    } catch (error) {
      setMessage("Hubo un error al actualizar el proyecto.");
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.updateProjectContainer}>
      <h1 style={styles.createClientHeader}>Actualizar Proyecto</h1>

      {/* Selección del proyecto */}
      <div style={styles.projectSelectContainer}>
        <h2>Selecciona un proyecto para editar</h2>
        <select onChange={(e) => handleProjectSelect(e.target.value)} style={styles.select}>
          <option value="">Seleccione un proyecto</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProject && (
        <>
          <h2>Detalles del Proyecto</h2>
          <form onSubmit={handleSubmit} style={styles.projectForm}>
            <label htmlFor="name" style={styles.label}>Nombre del Proyecto:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <label htmlFor="projectCode" style={styles.label}>Código del Proyecto:</label>
            <input
              type="text"
              name="projectCode"
              value={formData.projectCode}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <label htmlFor="email" style={styles.label}>Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <label htmlFor="internalCode" style={styles.label}>Código Interno del Proyecto:</label>
            <input
              type="text"
              name="internalCode"
              value={formData.internalCode}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? "Cargando..." : "Actualizar Proyecto"}
            </button>
          </form>
          {message && <p style={styles.message}>{message}</p>}
        </>
      )}
    </div>
  );
}

// Estilos CSS
const styles = {
  updateProjectContainer: {
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "center",
  },
  createClientHeader: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "20px",
  },
  projectSelectContainer: {
    marginBottom: "20px",
  },
  projectForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "left",
  },
  label: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#555",
    marginBottom: "8px",
  },
  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
    color: "#333",
    marginBottom: "20px",
  },
  select: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
    color: "#333",
    marginBottom: "20px",
  },
  submitButton: {
    background: "#0070f3",
    color: "white",
    padding: "12px 30px",
    fontSize: "18px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  submitButtonHover: {
    background: "#005bb5",
  },
  message: {
    marginTop: "20px",
    color: "#0070f3",
    fontWeight: "600",
  },
};
