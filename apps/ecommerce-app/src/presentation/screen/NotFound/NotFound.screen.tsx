import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@shopifruta/ui";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-12 px-4 text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-semibold mt-4 mb-2">Página no encontrada</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>

      <Link to="/">
        <Button className="px-6">Volver al inicio</Button>
      </Link>
    </div>
  );
};

export default NotFound;
