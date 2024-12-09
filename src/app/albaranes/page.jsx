"use client";

import CreateAlbaranes from "./createalbaranes/page";
import ListAlbaranes from "./listalbaranes/page";

export default function AlbaranesPage() {
  return (
    <div>
      <CreateAlbaranes />  {/* Componente para crear albaranes */}
      <ListAlbaranes />   {/* Componente para listar albaranes */}
    </div>
  );
}
