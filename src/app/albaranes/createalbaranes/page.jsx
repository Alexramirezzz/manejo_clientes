"use client";

import { useState, useEffect } from "react";

export default function CreateAlbaran() {
  const [formData, setFormData] = useState({
    name: "",
    projectCode: "",
    clientId: "",
    projectId: "",
    format: "material",  // Default value
    material: "",
    hours: "",
    description: "",
    workdate: "",
  });

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("jwt");

      if (!token) {
        setMessage("Por favor, inicia sesión.");
        return;
      }

      try {
        const response = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error.message);
      }
    };

    const fetchProjects = async () => {
      const token = localStorage.getItem("jwt");

      if (!token) {
        setMessage("Por favor, inicia sesión.");
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

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      }
    };

    fetchClients();
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.projectCode || !formData.clientId || !formData.projectId || !formData.workdate) {
      setMessage("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("jwt");

    if (!token) {
      setMessage("Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || "Error desconocido.");
        setLoading(false);
        return;
      }

      setMessage("Albarán creado con éxito.");
      setFormData({
        name: "",
        projectCode: "",
        clientId: "",
        projectId: "",
        format: "material",
        material: "",
        hours: "",
        description: "",
        workdate: "",
      });
    } catch (error) {
      setMessage("Error al crear el albarán: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.createAlbaranContainer}>
      <h1 style={styles.listTitle}>Crear Albarán</h1>  {/* Título actualizado */}
      <form onSubmit={handleSubmit} style={styles.albaranForm}>
        <label style={styles.label}>Nombre del Albarán:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.inputField}
        />

        <label style={styles.label}>Código del Proyecto:</label>
        <input
          type="text"
          name="projectCode"
          value={formData.projectCode}
          onChange={handleChange}
          required
          style={styles.inputField}
        />

        <label style={styles.label}>Seleccionar Cliente:</label>
        <select
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          required
          style={styles.clientSelect}
        >
          <option value="">Selecciona un cliente</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>

        <label style={styles.label}>Seleccionar Proyecto:</label>
        <select
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          required
          style={styles.clientSelect}
        >
          <option value="">Selecciona un proyecto</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        <label style={styles.label}>Formato:</label>
        <select
          name="format"
          value={formData.format}
          onChange={handleChange}
          required
          style={styles.clientSelect}
        >
          <option value="material">Material</option>
          <option value="hours">Horas</option>
        </select>

        {formData.format === "material" && (
          <>
            <label style={styles.label}>Material:</label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              required
              style={styles.inputField}
            />
          </>
        )}

        {formData.format === "hours" && (
          <>
            <label style={styles.label}>Horas:</label>
            <input
              type="number"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              required
              style={styles.inputField}
            />
          </>
        )}

        <label style={styles.label}>Descripción:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          style={styles.inputField}
        />

        <label style={styles.label}>Fecha de trabajo:</label>
        <input
          type="date"
          name="workdate"
          value={formData.workdate}
          onChange={handleChange}
          required
          style={styles.inputField}
        />

        <button type="submit" disabled={loading} style={styles.submitButton}>
          {loading ? "Cargando..." : "Crear Albarán"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  createAlbaranContainer: {
    background: "#fff",
    padding: "30px",  // Aumentado padding
    borderRadius: "8px",  // Bordes más redondeados
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",  // Sombra sutil
    width: "80%",
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "center",
    marginBottom: "40px",  // Más espacio abajo
  },
  listTitle: {
    fontSize: "28px",  // Título más grande
    marginBottom: "30px",
    color: "#333",
    fontWeight: "700",
  },
  albaranForm: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    textAlign: "left",
  },
  label: {
    fontSize: "16px",
    fontWeight: "600",
    textAlign: "left",
    marginBottom: "8px",
    color: "#555",
  },
  inputField: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",  // Bordes más redondeados
    width: "100%",
    fontSize: "16px",
    color: "#333",
  },
  clientSelect: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",  // Bordes más redondeados
    width: "100%",
    fontSize: "16px",
    color: "#333",
  },
  submitButton: {
    background: "#0070f3",
    color: "white",
    padding: "12px 30px",
    border: "none",
    borderRadius: "8px",  // Bordes más redondeados
    cursor: "pointer",
    fontSize: "18px",
    transition: "background 0.3s ease-in-out",
  },
  submitButtonHover: {
    background: "#005bb5",
  },
};
