"use client";  // Asegura que el código solo se ejecute en el cliente

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  // Para redirigir si el usuario no está autenticado

export default function HomePage() {
  const router = useRouter();

  const [clientsCount, setClientsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Verifica si el token existe en localStorage
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    // Si no hay token, redirigir al login
    if (!token) {
      router.push("/login");  // Redirige a la página de login si no hay token
    } else {
      fetchClientsCount();  // Si el token está presente, obtiene el número de clientes
      fetchProjectsCount(); // También obtiene el número de proyectos
    }
  }, [router]);

  // Función para obtener el número de clientes registrados
  const fetchClientsCount = async () => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setMessage("Por favor, inicia sesión primero.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los clientes.");
      }

      const data = await response.json();
      setClientsCount(data.length);  // Suponiendo que la API devuelve un array de clientes
    } catch (error) {
      setMessage("No se pudieron obtener los clientes.");
      console.error("Error al obtener los clientes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el número de proyectos registrados
  const fetchProjectsCount = async () => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setMessage("Por favor, inicia sesión primero.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/project", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los proyectos.");
      }

      const data = await response.json();
      setProjectsCount(data.length);  // Suponiendo que la API devuelve un array de proyectos
    } catch (error) {
      setMessage("No se pudieron obtener los proyectos.");
      console.error("Error al obtener los proyectos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando estadísticas...</p>;  // Mostrar mensaje mientras se cargan los datos

  return (
    <div style={styles.homePageContainer}>
      <div style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>Bienvenido a GestorPro</h1>
        <p style={styles.welcomeText}>La plataforma para gestionar tus proyectos y clientes de manera fácil y eficiente.</p>
      </div>

      <div style={styles.explanationSection}>
        <h2 style={styles.sectionTitle}>¿Qué es GestorPro?</h2>
        <p style={styles.sectionText}>
          GestorPro es una solución diseñada para optimizar la gestión de proyectos y clientes. Con una interfaz intuitiva, puedes crear y actualizar proyectos, gestionar clientes y llevar un control detallado de las interacciones.
        </p>
      </div>

      <div style={styles.statsSection}>
        <div style={styles.statItem}>
          <h3 style={styles.statTitle}>Clientes Registrados</h3>
          <p style={styles.statNumber}>{clientsCount}</p>
        </div>
        <div style={styles.statItem}>
          <h3 style={styles.statTitle}>Proyectos Registrados</h3>
          <p style={styles.statNumber}>{projectsCount}</p>
        </div>
      </div>

      <div style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Características principales</h2>
        <ul style={styles.featureList}>
          <li>Gestión de clientes y proyectos en tiempo real.</li>
          <li>Interfaz intuitiva y fácil de usar.</li>
          <li>Seguimiento detallado de cada proyecto y cliente.</li>
          <li>Acceso controlado mediante autenticación.</li>
          <li>Seguridad y privacidad de los datos.</li>
        </ul>
      </div>

      <div style={styles.ctaSection}>
        <h3 style={styles.ctaTitle}>Empieza a gestionar tus proyectos y clientes hoy mismo.</h3>
        <button style={styles.ctaButton} onClick={() => router.push("/clientes")}>Ver Clientes</button>
        <button style={styles.ctaButton} onClick={() => router.push("/proyectos")}>Ver Proyectos</button>
      </div>
    </div>
  );
}

// Estilos CSS para hacer la página más profesional
const styles = {
  homePageContainer: {
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f9fafb",
    color: "#333",
    padding: "50px 20px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  welcomeSection: {
    textAlign: "center",
    backgroundColor: "#4A90E2",
    color: "white",
    padding: "40px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  welcomeTitle: {
    fontSize: "40px",
    fontWeight: "600",
  },
  welcomeText: {
    fontSize: "18px",
    marginTop: "10px",
    fontWeight: "400",
  },
  explanationSection: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    marginTop: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  sectionTitle: {
    fontSize: "32px",
    color: "#4A90E2",
  },
  sectionText: {
    fontSize: "18px",
    marginTop: "10px",
    color: "#777",
  },
  statsSection: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "40px",
    gap: "20px",
  },
  statItem: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "45%",
  },
  statTitle: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#333",
  },
  statNumber: {
    fontSize: "40px",
    fontWeight: "700",
    color: "#0070f3",
  },
  featuresSection: {
    backgroundColor: "#fff",
    padding: "40px 20px",
    marginTop: "50px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  featureList: {
    listStyle: "none",
    padding: "0",
    textAlign: "left",
    fontSize: "18px",
    color: "#555",
  },
  ctaSection: {
    textAlign: "center",
    marginTop: "50px",
  },
  ctaTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
  },
  ctaButton: {
    backgroundColor: "#0070f3",
    color: "white",
    padding: "15px 30px",
    fontSize: "18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    margin: "15px",
  },
    ctaButton: {
      backgroundColor: "#0070f3",
      color: "white",
      padding: "15px 30px",
      fontSize: "18px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      margin: "15px",
      transition: "background-color 0.3s ease",
    },
    ctaButtonHover: {
      backgroundColor: "#005bb5",
    },
  };
  
  