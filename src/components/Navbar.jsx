"use client"; // Asegura que el código se ejecute solo en el cliente

import { useState, useEffect } from "react";
import Link from "next/link"; // Importa Link de next/link
import { useRouter } from "next/navigation"; // Usamos el router de Next.js para redirección

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Para verificar si el usuario está logueado
  const router = useRouter();

  // Verifica si hay un token en localStorage al cargar el Navbar
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsLoggedIn(true); // Si hay un token, el usuario está logueado
    } else {
      setIsLoggedIn(false); // Si no hay token, el usuario no está logueado
    }
  }, []);

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem("jwt"); // Elimina el token de localStorage
    setIsLoggedIn(false); // Actualiza el estado para reflejar que el usuario ha cerrado sesión
    router.push("/register"); // Redirige a la página de registro
  };

  return (
    <nav style={styles.navbar}>
      {/* Sección de navegación */}
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link href="/" style={styles.link}>Home</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/clientes" style={styles.link}>Clientes</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/proyectos" style={styles.link}>Proyectos</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/albaranes" style={styles.link}>Albaranes</Link>
        </li>
      </ul>

      {/* Botón de Logout si el usuario está logueado */}
      {isLoggedIn && (
        <div style={styles.authButtons}>
          <button style={styles.button} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    background: "#0070f3",
    padding: "15px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    position: "sticky", // Hace que el navbar se quede fijo en la parte superior
    top: 0,
    width: "100%",
    zIndex: 1000,
    maxWidth: "100%",  // Limita el ancho máximo
    boxSizing: "border-box", // Asegura que el padding no sobrepase el tamaño de la pantalla
  },
  navList: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    gap: "20px",
    flexWrap: "wrap", // Permite que los elementos se acomoden en pantallas pequeñas
  },
  navItem: {
    fontSize: "16px",
    fontWeight: "500",
  },
  link: {
    color: "white",
    textDecoration: "none",
    transition: "color 0.3s ease", // Transición suave para el hover
  },
  linkHover: {
    color: "#ffcc00", // Color dorado cuando el enlace es hover
  },
  authButtons: {
    display: "flex",
    gap: "15px",
  },
  button: {
    background: "none",
    border: "2px solid white",
    color: "white",
    borderRadius: "8px",
    padding: "8px 15px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#005bb5", // Cambio de color de fondo cuando se pasa el cursor
    transform: "scale(1.05)", // Efecto de agrandado al pasar el cursor
  },
};
