"use client";

import { useState, useEffect } from "react";

export default function ListClients() {
  const [clients, setClients] = useState([]);  // Estado para almacenar los clientes
  const [loading, setLoading] = useState(true);  // Estado para manejar la carga
  const [message, setMessage] = useState("");  // Mensajes de error o éxito
  const [expandedClient, setExpandedClient] = useState(null);  // Estado para el cliente seleccionado

  // UseEffect para cargar los clientes al montar el componente
  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("jwt");  // Obtener el token del localStorage

      if (!token) {
        setMessage("Por favor, inicia sesión para ver los clientes.");
        setLoading(false);
        return;  // Si no hay token, no continuar
      }

      try {
        const response = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
          method: "GET",  // Solicitar los clientes
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,  // Pasar el token como Authorization Bearer
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error desconocido.");
        }

        const data = await response.json();
        setClients(data);  // Almacenar los clientes en el estado
      } catch (error) {
        setMessage("No se pudieron obtener los clientes.");
        console.error("Error al obtener los clientes:", error.message);
      } finally {
        setLoading(false);  // Terminar la carga
      }
    };

    fetchClients();  // Llamar a la función para obtener los clientes
  }, []);  // Se ejecuta solo una vez cuando el componente se monta

  const handleClientClick = (client) => {
    // Si ya se ha hecho clic en el mismo cliente, lo colapsamos
    if (expandedClient === client._id) {
      setExpandedClient(null);
    } else {
      setExpandedClient(client._id);  // Mostrar detalles del cliente seleccionado
    }
  };

  const handleDeleteClient = async (clientId) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setMessage("Por favor, inicia sesión para eliminar un cliente.");
      return;
    }

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el cliente.");
      }

      setClients(clients.filter(client => client._id !== clientId));  // Eliminar el cliente de la lista
      setMessage("Cliente eliminado con éxito.");
    } catch (error) {
      console.error("Error eliminando cliente:", error.message);
      setMessage("No se pudo eliminar el cliente.");
    }
  };

  if (loading) return <p style={styles.loadingText}>Cargando clientes...</p>;  // Mostrar mensaje mientras se cargan los clientes

  return (
    <div style={styles.listClientBlock}>
      <h1 style={styles.listTitle}>Lista de Clientes</h1>
      {message && <p style={styles.listMessage}>{message}</p>}
      <ul style={styles.clientList}>
        {clients.length === 0 ? (
          <li style={styles.clientItem}>No hay clientes registrados.</li>  // Si no hay clientes
        ) : (
          clients.map((client) => (
            <li key={client._id} style={styles.clientItem}>
              <div style={styles.clientName}>
                <span>{client.name}</span>
                <button onClick={() => handleClientClick(client)} style={styles.viewButton}>
                  {expandedClient === client._id ? "Ocultar detalles" : "Ver detalles"}
                </button>
                <button onClick={() => handleDeleteClient(client._id)} style={styles.deleteButton}>
                  Eliminar
                </button>
              </div>

              {/* Mostrar detalles solo si el cliente está expandido */}
              {expandedClient === client._id && (
                <div style={styles.clientDetails}>
                  <p><strong>Nombre:</strong> {client.name}</p>
                  <p><strong>Calle:</strong> {client.address.street}</p>
                  <p><strong>Número:</strong> {client.address.number}</p>
                  <p><strong>Código Postal:</strong> {client.address.postal}</p>
                  <p><strong>Ciudad:</strong> {client.address.city}</p>
                  <p><strong>Provincia:</strong> {client.address.province}</p>
                  <p><strong>CIF:</strong> {client.cif}</p>
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
  listClientBlock: {
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
  clientList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
    textAlign: "left",
  },
  clientItem: {
    padding: "20px",
    marginBottom: "20px", // Más espacio entre los elementos
    borderRadius: "8px",
    background: "#f9f9f9", // Fondo más claro
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderLeft: "8px solid #0070f3", // Indicador visual en el borde izquierdo
  },
  clientName: {
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
  deleteButton: {
    background: "#ff4d4d",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "15px",
    transition: "background-color 0.3s ease",
  },
  clientDetails: {
    marginTop: "15px",
    padding: "15px",
    background: "#f0f0f0",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#555",
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
