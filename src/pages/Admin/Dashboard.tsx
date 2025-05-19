
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
    document.title = "Panel de Administración | Río Segundo";
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-secondary min-h-screen">
      <div className="bg-background shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-serif text-lg font-bold">Río Segundo</span>
            <span className="ml-2 text-sm text-muted-foreground">Panel de Administración</span>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
            >
              Ver sitio
            </Button>
            <Button 
              variant="destructive"
              onClick={logout}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-center text-muted-foreground">
            Esta sección requiere integración con Supabase para su funcionalidad completa.
            <br />
            Aquí podrás gestionar tus productos, categorías y pedidos.
          </p>
        </div>
      </div>
    </div>
  );
}
