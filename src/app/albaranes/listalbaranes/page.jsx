"use client";

import { useState, useEffect } from "react";
import downloadPDF from "../pdf/page";  // Importamos la función de descarga

export default function ListAlbaranes() {
  const [albaranes, setAlbaranes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAlbaran, setExpandedAlbaran] = useState(null); // Almacenar albarán expandido
  const [message, setMessage] = useState("");

  // Función para obtener los albaranes de la API
  useEffect(() => {
    const fetchAlbaranes = async () => {
      const token = localStorage.getItem("jwt");

      if (!token) {
        setMessage("Por favor, inicia sesión para ver los albaranes.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error desconocido.");
        }

        const data = await response.json();
        setAlbaranes(data);  // Guardar albaranes en el estado
      } catch (error) {
        setMessage("No se pudieron obtener los albaranes.");
        console.error("Error al obtener los albaranes:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbaranes(); // Llamar a la función para obtener los albaranes
  }, []);

  const handleAlbaranClick = (albaran) => {
    // Si ya se ha hecho clic en el mismo albarán, lo colapsamos
    if (expandedAlbaran === albaran._id) {
      setExpandedAlbaran(null);
    } else {
      setExpandedAlbaran(albaran._id); // Mostrar detalles del albarán seleccionado
    }
  };

  if (loading) return <p>Cargando albaranes...</p>;

  return (
    <div style={styles.listAlbaranBlock}>
      <h1 style={styles.listTitle}>Lista de Albaranes</h1>
      {message && <p style={styles.listMessage}>{message}</p>}
      <ul style={styles.albaranList}>
        {albaranes.length === 0 ? (
          <li style={styles.albaranItem}>No hay albaranes registrados.</li>
        ) : (
          albaranes.map((albaran) => (
            <li key={albaran._id} style={styles.albaranItem}>
              <div style={styles.albaranHeader}>
                <span>{albaran.name}</span> {/* Nombre del albarán */}
                <span>Proyecto: {albaran.projectId?.name}</span> {/* Nombre del proyecto */}
                <button onClick={() => handleAlbaranClick(albaran)} style={styles.viewButton}>
                  {expandedAlbaran === albaran._id ? "Ocultar detalles" : "Ver detalles"}
                </button>
                {/* Botón para descargar PDF */}
                <button onClick={() => downloadPDF(albaran._id)} style={styles.downloadButton}>
                  Descargar PDF
                </button>
              </div>

              {/* Mostrar detalles solo si el albarán está expandido */}
              {expandedAlbaran === albaran._id && (
                <div style={styles.albaranDetails}>
                  <p><strong>Proyecto:</strong> {albaran.projectId?.name}</p>
                  <p><strong>Formato:</strong> {albaran.format}</p>
                  {albaran.format === "material" && (
                    <p><strong>Material:</strong> {albaran.material}</p>
                  )}
                  {albaran.format === "hours" && (
                    <p><strong>Horas:</strong> {albaran.hours}</p>
                  )}
                  <p><strong>Descripción:</strong> {albaran.description}</p>
                  <p><strong>Fecha de trabajo:</strong> {albaran.workdate}</p>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

// Estilos CSS
const styles = {
  listAlbaranBlock: {
    background: "#fff",
    padding: "30px", // Aumentado padding
    borderRadius: "12px", // Bordes más redondeados
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)", // Sombra más prominente
    width: "80%",
    maxWidth: "2000px",
    margin: "0 auto",
    marginBottom: "40px", // Más espacio al fondo
  },
  listTitle: {
    fontSize: "28px",  // Título más grande
    marginBottom: "25px",
    color: "#333",
    fontWeight: "700",
  },
  albaranList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
    textAlign: "left",
  },
  albaranItem: {
    padding: "20px",
    marginBottom: "25px", // Más espacio entre los elementos
    borderRadius: "8px",
    background: "#f9f9f9", // Fondo más claro
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderLeft: "8px solid #0070f3", // Indicador visual en el borde izquierdo
  },
  albaranHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewButton: {
    background: "#0070f3",
    color: "white",
    padding: "8px 16px", // Botones más grandes
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "15px",
    transition: "background-color 0.3s ease",
  },
  downloadButton: {
    background: "#ffcc00",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "15px",
    transition: "background-color 0.3s ease",
  },
  albaranDetails: {
    marginTop: "15px",
    padding: "20px",
    background: "#f0f0f0",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#555",
  },
  listMessage: {
    marginTop: "25px",
    color: "#0070f3",
    fontWeight: "600",
  },
};

