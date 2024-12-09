"use client";  // Asegura que el código se ejecute solo en el cliente

import React from "react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} Delivery Note Management System</p>
      <nav style={styles.nav}>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          GitHub
        </a>
        <a
          href="https://example.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Privacy Policy
        </a>
        <a
          href="https://example.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Terms of Service
        </a>
      </nav>
    </footer>
  );
}

// Estilos en el mismo archivo
const styles = {
  footer: {
    backgroundColor: "#0070f3",  // Color de fondo fijo, puedes cambiarlo aquí
    color: "white",
    textAlign: "center",
    padding: "20px 20px",
    width: "100%",
    boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)",
  },
  nav: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },
  linkHover: {
    textDecoration: "underline",
  },
};
