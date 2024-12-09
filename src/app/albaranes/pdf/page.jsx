"use client";

export default async function downloadPDF(albaranId) {
  const token = localStorage.getItem("jwt");

  if (!token) {
    alert("Por favor, inicia sesión para descargar el albarán.");
    return;
  }

  try {
    // Utiliza la URL correcta para la API
    const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${albaranId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo descargar el albarán.");
    }

    // Crear un enlace para descargar el archivo PDF
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `albaran_${albaranId}.pdf`; // Nombre del archivo PDF a descargar
    link.click(); // Inicia la descarga
  } catch (error) {
    alert("Hubo un error al intentar descargar el albarán.");
    console.error("Error al descargar el albarán:", error);
  }
}
