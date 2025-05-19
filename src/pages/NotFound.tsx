
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Página no encontrada | Río Segundo";
    console.error(
      "404 Error: Usuario intentó acceder a una ruta inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif text-trattoria-red">404</h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-6 font-serif">¡Oops! Página no encontrada</p>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          La página que estás buscando no existe o ha sido movida a otra ubicación.
        </p>
        <Button asChild className="bg-trattoria-red hover:bg-trattoria-red/90">
          <NavLink to="/">Volver al Inicio</NavLink>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
