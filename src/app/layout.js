"use client"; // Asegura que se ejecute solo en el cliente

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Usamos el router para redirigir
import Register from "./register/page"; // Página de registro
import Validate from "./validate/page"; // Página de validación
import Login from "./login/page"; // Página de login
import Navbar from "../components/Navbar"; // Importa el Navbar
import Footer from "../components/Footer"; // Importa el Footer
import "./styles/auth.css";
import "./page";

export default function Layout({ children }) {
  const router = useRouter();
  const [authStep, setAuthStep] = useState("register");  // Paso inicial: registro
  const [token, setToken] = useState(null);  // Estado para manejar el token

  useEffect(() => {
    const savedToken = localStorage.getItem("jwt");  // Verifica si hay un token en localStorage
    if (savedToken) {
      setToken(savedToken);  // Si el token está presente, lo almacenamos en el estado
      router.push("/"); // Redirigir al home
    } else {
      router.push("/login");  // Si no hay token, redirigir al login
    }
  }, [router]);

  // Función para avanzar en el flujo de autenticación
  const handleNextStep = (step) => {
    setAuthStep(step);  // Cambiar entre los pasos: register, validate, login
  };

  return (
    <html lang="es">
      <head>
        <title>Mi Aplicación</title>
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Mostrar Navbar y Footer solo si el usuario está logueado */}
        {token ? (
          <>
            <Navbar /> {/* El Navbar siempre visible cuando el usuario está logueado */}
            <main className="flex-grow">
              {children}
            </main>
            <Footer></Footer>
          </>
        ) : (
          <div className="flex-grow flex justify-center items-center">
            {/* Mostramos el proceso de autenticación (register, validate, login) */}
            {authStep === "register" && (
              <Register onRegisterSuccess={() => handleNextStep("validate")} />
            )}

            {authStep === "validate" && (
              <Validate onValidationSuccess={() => handleNextStep("login")} />
            )}

            {authStep === "login" && (
              <Login onLoginSuccess={() => router.push("/")} />
            )}
          </div>
        )}
      </body>
    </html>
  );
}
