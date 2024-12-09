"use client"; // Asegura que el código solo se ejecute en el cliente

import { useState, useEffect } from "react";

export default function CreateProject() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);  // Lista de clientes para el selector
  const [selectedClient, setSelectedClient] = useState(null); // Cliente seleccionado
  const [formData, setFormData] = useState({
    name: "",
    projectCode: "",
    email: "",
    code: "",
    clientId: "",  // El cliente se selecciona al hacer clic en el selector
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch clientes al cargar el componente
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

        if (!response.ok) {
          setMessage("Error al obtener clientes.");
          return;
        }

        const data = await response.json();
        setClients(data); // Almacenar clientes en el estado
      } catch (error) {
        setMessage("No se pudieron cargar los clientes.");
      }
    };

    fetchClients();
  }, []);

  const handleSelectClient = (e) => {
    const clientId = e.target.value;
    const client = clients.find((client) => client._id === clientId);
    setSelectedClient(client);  // Set the selected client
    setFormData((prevData) => ({
      ...prevData,
      clientId: clientId,  // Establece el clientId en los datos del formulario
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.projectCode || !formData.email || !formData.code) {
      setMessage("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      setMessage("Por favor, inicia sesión primero.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData, // Incluye todos los datos del formulario
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el proyecto.");
      }

      setMessage("¡Proyecto creado con éxito!");
      setFormData({
        name: "",
        projectCode: "",
        email: "",
        code: "",
        clientId: "",  // Resetear el clientId
      });
    } catch (error) {
      setMessage("Hubo un error al crear el proyecto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.createProjectContainer}>
      <h1 style={styles.listTitle}>Crear Proyecto</h1>
      {message && <p style={styles.listMessage}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.projectForm}>
        <label style={styles.label}>Seleccionar Cliente</label>
        <select
          name="clientId"
          onChange={handleSelectClient}
          value={formData.clientId}
          style={styles.clientSelect}
        >
          <option value="">Seleccione un Cliente</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>

        {/* Si un cliente es seleccionado, mostramos su información */}
        {selectedClient && (
          <div style={styles.clientDetails}>
            <p><strong>Cliente:</strong> {selectedClient.name}</p>
            <p><strong>Calle:</strong> {selectedClient.address.street}</p>
            <p><strong>Número:</strong> {selectedClient.address.number}</p>
            <p><strong>Código Postal:</strong> {selectedClient.address.postal}</p>
            <p><strong>Ciudad:</strong> {selectedClient.address.city}</p>
            <p><strong>Provincia:</strong> {selectedClient.address.province}</p>
            <p><strong>CIF:</strong> {selectedClient.cif}</p>
          </div>
        )}

        <label style={styles.label}>Nombre del Proyecto</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={styles.projectInput}
          required
        />

        <label style={styles.label}>Código del Proyecto</label>
        <input
          type="text"
          name="projectCode"
          value={formData.projectCode}
          onChange={handleChange}
          style={styles.projectInput}
          required
        />

        <label style={styles.label}>Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.projectInput}
          required
        />

        <label style={styles.label}>Código Interno del Proyecto</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          style={styles.projectInput}
          required
        />

        <button type="submit" style={styles.submitButton}>
          {loading ? "Cargando..." : "Crear Proyecto"}
        </button>
      </form>
    </div>
  );
}

// Estilos CSS mejorados
const styles = {
  createProjectContainer: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    width: "80%",
    maxWidth: "900px",
    margin: "0 auto",
    marginBottom: "50px",
    textAlign: "center",
  },
  listTitle: {
    fontSize: "28px",
    marginBottom: "30px",
    color: "#333",
    fontWeight: "700",
  },
  projectForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "left",
    width: "100%",
  },
  label: {
    fontSize: "16px",
    fontWeight: "600",
    textAlign: "left",
    marginBottom: "8px",
    color: "#555",
  },
  projectInput: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "100%",
    fontSize: "16px",
    color: "#333",
  },
  clientSelect: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "100%",
    fontSize: "16px",
    color: "#333",
  },
  clientDetails: {
    background: "#f4f4f4",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "10px",
    textAlign: "left",
    fontSize: "16px",
    color: "#555",
  },
  submitButton: {
    background: "#0070f3",
    color: "white",
    padding: "12px 30px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    transition: "background 0.3s ease-in-out",
  },
  submitButtonHover: {
    background: "#005bb5",
  },
  listMessage: {
    marginTop: "20px",
    color: "#0070f3",
    fontSize: "16px",
  },
};
