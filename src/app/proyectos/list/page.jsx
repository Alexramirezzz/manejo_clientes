"use client";

import { useState, useEffect } from "react";

export default function ListProjects() {
  const [projects, setProjects] = useState([]);  // Estado para almacenar proyectos
  const [clients, setClients] = useState([]);  // Estado para almacenar los clientes
  const [loading, setLoading] = useState(true);  // Estado para manejar la carga
  const [expandedProjectId, setExpandedProjectId] = useState(null);  // Estado para manejar la expansión de un proyecto
  const [message, setMessage] = useState("");  // Mensajes de error o éxito

  // Fetch clientes y proyectos al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwt");

      if (!token) {
        setMessage("Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        const [clientsResponse, projectsResponse] = await Promise.all([
          fetch("https://bildy-rpmaya.koyeb.app/api/client", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("https://bildy-rpmaya.koyeb.app/api/project", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!clientsResponse.ok || !projectsResponse.ok) {
          setMessage("Error al obtener los datos.");
          return;
        }

        const clientsData = await clientsResponse.json();
        const projectsData = await projectsResponse.json();

        setClients(clientsData);  // Almacenar los clientes
        setProjects(projectsData);  // Almacenar los proyectos
        setLoading(false);
      } catch (error) {
        setMessage("No se pudieron cargar los proyectos o clientes.");
        setLoading(false);
      }
    };

    fetchData();  // Llamar a la función para obtener los proyectos y clientes
  }, []);

  const handleViewDetails = (projectId) => {
    // Si el proyecto ya está expandido, lo colapsamos
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  if (loading) return <p style={styles.loadingText}>Cargando proyectos...</p>;

  return (
    <div style={styles.listProjectBlock}>
      <h1 style={styles.listTitle}>Lista de Proyectos</h1>
      {message && <p style={styles.listMessage}>{message}</p>}
      <ul style={styles.projectList}>
        {projects.length === 0 ? (
          <li style={styles.projectItem}>No hay proyectos registrados.</li>
        ) : (
          projects.map((project, index) => {
            const client = clients.find((client) => client._id === project.clientId);
            return (
              <li key={index} style={styles.projectItem}>
                <div style={styles.projectName}>
                  <span>{project.name} - {client ? client.name : 'Cliente no encontrado'}</span>
                  <button
                    onClick={() => handleViewDetails(project._id)}
                    style={styles.viewButton}
                  >
                    {expandedProjectId === project._id ? "Ocultar detalles" : "Ver detalles"}
                  </button>
                </div>

                {/* Mostrar detalles del proyecto debajo */}
                {expandedProjectId === project._id && (
                  <div style={styles.projectDetails}>
                    <p><strong>Nombre del Proyecto:</strong> {project.name}</p>
                    <p><strong>Código del Proyecto:</strong> {project.projectCode}</p>
                    <p><strong>Email:</strong> {project.email}</p>
                    <p><strong>Código Interno:</strong> {project.code}</p>
                    <p><strong>Cliente:</strong> {client ? client.name : 'No encontrado'}</p>
                  </div>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}


// Estilos CSS para Lista de Proyectos
const styles = {
  listProjectBlock: {
    background: "#ffffff",
    padding: "30px", // Aumentado el padding para hacerlo más grande
    borderRadius: "12px", // Bordes más redondeados
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)", // Sombra más prominente
    width: "90%",  // Mayor ancho, ocupa más espacio
    maxWidth: "2000px", // Más ancho máximo
    margin: "0 auto",
    marginBottom: "40px", // Más espacio al fondo
  },
  listTitle: {
    fontSize: "30px", // Título más grande
    marginBottom: "25px",
    color: "#333",
    fontWeight: "700", // Fuente en negrita
  },
  projectList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
    textAlign: "left",
  },
  projectItem: {
    padding: "20px",
    marginBottom: "20px", // Más espacio entre los elementos
    borderRadius: "8px",
    background: "#f9f9f9", // Fondo más claro
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderLeft: "8px solid #0070f3", // Indicador visual en el borde izquierdo
    transition: "box-shadow 0.3s ease-in-out", // Suavizado en la transición de sombra
  },
  projectItemHover: {
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Efecto hover para los elementos
  },
  projectName: {
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
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  viewButtonHover: {
    background: "#005bb5", // Cambio de color en hover
    transform: "scale(1.05)", // Efecto de crecimiento en hover
  },
  deleteButton: {
    background: "#ff4d4d",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "15px",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  deleteButtonHover: {
    background: "#ff1a1a", // Cambio de color en hover
    transform: "scale(1.05)", // Efecto de crecimiento en hover
  },
  projectDetails: {
    marginTop: "15px",
    padding: "15px",
    background: "#f0f0f0",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.6",
  },
  listMessage: {
    marginTop: "25px",
    color: "#28a745",
    fontWeight: "600",
  },
  loadingText: {
    textAlign: "center",
    color: "#333",
    fontSize: "22px",
  },
};
