"use client";  // Para asegurarte de que se ejecute solo en el cliente

import { useState } from "react";
import { useRouter } from "next/navigation"; // Usamos el router de Next.js para redirigir

export default function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();  // Usamos el hook router para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("jwt", data.token); // Guardar el token JWT
        setMessage("Login exitoso.");
        
        // Recargar la página para reflejar el estado de inicio de sesión
        window.location.reload(); // Esto recargará la página y actualizará el estado del usuario

      } else {
        const data = await response.json();
        setMessage(data.message || "Hubo un error al iniciar sesión.");
      }
    } catch (error) {
      setMessage("Hubo un error en el login.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required 
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
