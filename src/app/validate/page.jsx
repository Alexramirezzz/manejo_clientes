"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";  // Para redirigir después de la validación

export default function Validate({ onValidationSuccess }) {
  const [validationCode, setValidationCode] = useState("");  // El código de validación ingresado por el usuario
  const [message, setMessage] = useState("");  // Mensaje de éxito o error
  const router = useRouter();  // Para navegar entre páginas

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwt");  // Obtener el token del localStorage

    if (!token) {
      setMessage("No se ha encontrado un token de sesión. Inicia sesión primero.");
      return;
    }

    try {
      // Enviar el código de validación a la API
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/validation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ code: validationCode }),  // Enviar el código ingresado
      });

      if (response.ok) {
        setMessage("Cuenta validada exitosamente.");
        onValidationSuccess();  // Cambia al siguiente paso, que sería login
      } else {
        const data = await response.json();
        setMessage(data.message || "Hubo un error al validar.");
      }
    } catch (error) {
      setMessage("Hubo un error en la validación.");
      console.error("Error de validación:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Validar Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Código de validación" 
          value={validationCode}
          onChange={(e) => setValidationCode(e.target.value)}
          required 
          className="form-input"
        />
        <button type="submit" className="auth-button">Validar</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
