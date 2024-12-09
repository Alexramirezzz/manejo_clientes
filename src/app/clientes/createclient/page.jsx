"use client"; // Asegura que el código se ejecute solo en el cliente

import { useState } from "react";

export default function CrearCliente() {
  const [formData, setFormData] = useState({
    name: "",
    address: {
      street: "",
      number: "",
      postal: "",
      city: "",
      province: "",
    },
    cif: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.address) {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.name ||
      !formData.cif ||
      !formData.address.street ||
      !formData.address.number ||
      !formData.address.city ||
      !formData.address.province ||
      !formData.address.postal
    ) {
      setMessage("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("jwt"); // Usamos jwt

    if (!token) {
      setMessage("Por favor, inicia sesión primero.");
      setLoading(false);
      return;
    }

    // Obtener userId desde el token (JWT)
    const userId = JSON.parse(atob(token.split(".")[1])).userId;

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // Corregido la sintaxis de la cabecera
        },
        body: JSON.stringify({
          userId, // Enviar el userId junto con los demás campos
          name: formData.name,
          cif: formData.cif,
          address: formData.address, // Dirección estructurada correctamente
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Errores de API:", errorData.errors);
        const errorMessage = errorData.errors.map((err) => err.message).join(", ");
        setMessage(`Error al crear el cliente: ${errorMessage}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setMessage("¡Cliente creado con éxito!");
      setFormData({
        name: "",
        address: {
          street: "",
          number: "",
          postal: "",
          city: "",
          province: "",
        },
        cif: "",
      });
    } catch (error) {
      console.error("Error creando cliente:", error.message);
      setMessage("Hubo un error al crear el cliente: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.createClientContainer}>
      <h1 style={styles.createClientHeader}>Crear Cliente</h1>
      <form onSubmit={handleSubmit} style={styles.projectForm}>
        {[  // Usamos un array para mapear los campos y reducir código repetitivo
          { name: "name", label: "Nombre del Cliente" },
          { name: "street", label: "Calle" },
          { name: "number", label: "Número" },
          { name: "postal", label: "Código Postal" },
          { name: "city", label: "Ciudad" },
          { name: "province", label: "Provincia" },
          { name: "cif", label: "CIF" },
        ].map((field) => (
          <div key={field.name} style={styles.formGroup}>
            <label htmlFor={field.name} style={styles.label}>
              {field.label}:
            </label>
            <input
              type="text"
              name={field.name}
              value={field.name === "name" ? formData.name : formData.address[field.name] || formData[field.name]}
              onChange={handleChange}
              required
              style={styles.projectInput}
            />
          </div>
        ))}
        <button type="submit" disabled={loading} style={styles.submitButton}>
          {loading ? "Cargando..." : "Crear Cliente"}
        </button>
      </form>
      {message && <p style={styles.listMessage}>{message}</p>}
    </div>
  );
}

// Estilos con CSS-in-JS
const styles = {
  createClientContainer: {
    background: "#f4f7fa",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    width: "100%",
    textAlign: "center",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: "30px",
  },
  createClientHeader: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "30px",
  },
  projectForm: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "stretch",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  label: {
    fontSize: "16px",
    fontWeight: "500",
    textAlign: "left",
    marginBottom: "5px",
  },
  projectInput: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    width: "100%",
    fontSize: "16px",
  },
  submitButton: {
    background: "#0070f3",
    color: "white",
    padding: "12px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  submitButtonHover: {
    background: "#005bb5",
  },
  listMessage: {
    marginTop: "20px",
    color: "#0070f3",
  },
};
