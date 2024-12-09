"use client";  // Asegura que el archivo se ejecute solo en el cliente

import { useState } from "react";
import { useRouter } from "next/navigation";  // Usamos el router para redirigir
import Link from "next/link"; // Importamos Link para la navegación

export default function Register({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();  // Usamos el hook router para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      // Hacer la solicitud de registro
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // Si la respuesta es exitosa
      if (response.ok) {
        const data = await response.json();  // Obtener la respuesta JSON

        // Si la API devuelve un token, guardarlo en localStorage
        if (data.token) {
          localStorage.setItem("jwt", data.token);  // Guardamos el token en localStorage
          setMessage("Registro exitoso. Ahora valida tu cuenta.");

          // Llamamos a la función para avanzar al siguiente paso
          onRegisterSuccess();  // Aquí se puede manejar el cambio de estado del formulario
        } else {
          setMessage("No se recibió el token, intenta de nuevo.");
        }
      } else {
        const data = await response.json();
        setMessage(data.message || "Hubo un error al registrar.");
      }
    } catch (error) {
      setMessage("Hubo un error en el registro.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box modal-register">
        <h2>Registrar Cuenta</h2>
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
          <input 
            type="password" 
            placeholder="Confirmar Contraseña" 
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required 
          />
          <button type="submit">Registrar</button>
        </form>
        {message && <p>{message}</p>}

        <div style={styles.container}>
          <p style={styles.text}>
            Si ya tienes cuenta:{' '}
            {/* Usamos Link de Next.js para redirigir correctamente */}
            <Link href="/login" style={styles.link}>Inicia Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '20px',
    textAlign: 'center',
  },
  text: {
    fontSize: '16px',
    color: '#333',
  },
  link: {
    color: '#0070f3',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
