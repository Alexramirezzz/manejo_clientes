"use client"; // Asegura que el código se ejecute solo en el cliente

import CreateProject from "./CreateProject/page"; // Asegúrate de que las rutas sean correctas
import ListProjects from "./list/page";
import Link from "next/link"; // Necesario para manejar la navegación

export default function ProjectsPage() {
  return (
    <div className="projects-page">
      {/* Bloque para Crear Proyecto */}
      <div className="create-project-container">
        <CreateProject /> {/* Componente para crear un proyecto */}
      </div>

      {/* Bloque para Listar Proyectos */}
      <div className="projects-list-container">
        <ListProjects /> {/* Componente para listar los proyectos */}
      </div>

      {/* Bloque para la edición de un proyecto */}
      <div className="edit-project-container" style={styles.editContainer}>
        <h2 style={styles.editTitle}>Editar Proyecto</h2>
        {/* Enlace para ir a la página de editar proyecto */}
        <Link href="/proyectos/UpdateProject" passHref>
          <button style={styles.editButton}>Editar Proyecto</button>
        </Link>
      </div>
    </div>
  );
}

// Estilos para el contenedor y el botón de edición
const styles = {
  editContainer: {
    textAlign: "center", // Centrado del contenido
    marginTop: "40px", // Espaciado hacia abajo
    padding: "20px",
    backgroundColor: "#f8f9fa", // Fondo ligeramente gris para contrastar
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  editTitle: {
    fontSize: "28px",
    color: "#333",
    fontWeight: "600",
    marginBottom: "20px",
  },
  editButton: {
    backgroundColor: "#0070f3", // Fondo azul
    color: "#fff", // Texto blanco
    padding: "14px 40px", // Relleno para un botón más grande
    fontSize: "18px", // Tamaño de texto más grande
    border: "none",
    borderRadius: "8px", // Bordes redondeados
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Sombra ligera
    transition: "background-color 0.3s ease, transform 0.3s ease-in-out", // Transición suave
  },
  editButtonHover: {
    backgroundColor: "#005bb5", // Cambio a color más oscuro
    transform: "scale(1.05)", // Aumentar el tamaño al hacer hover
  },
};
