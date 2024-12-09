"use client"; // Debe ir al principio del archivo

import CreateClient from "./createclient/page"; // Asegúrate de que las rutas sean correctas
import ListClients from "./list/page";

export default function ClientsPage() {
  return (
    <div className="clients-page">
      {/* Bloque para Crear Cliente */}
      <div className="create-client-container">
        <CreateClient /> {/* Componente para crear un cliente */}
      </div>

      {/* Bloque para Listar Clientes */}
      <div className="list-client-container">
        <ListClients />  {/* Componente para listar los clientes */}
      </div>
    </div>
  );
}
