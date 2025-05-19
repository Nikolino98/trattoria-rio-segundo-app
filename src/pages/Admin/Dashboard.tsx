
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuItemsManager from "@/components/admin/MenuItemsManager";
import CategoriesManager from "@/components/admin/CategoriesManager";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
    document.title = "Panel de Administración | Río Segundo";
    setLoading(false);
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-secondary min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
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
        
        <Tabs defaultValue="menu-items" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="menu-items">Productos</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
          </TabsList>
          <TabsContent value="menu-items" className="mt-4">
            <MenuItemsManager />
          </TabsContent>
          <TabsContent value="categories" className="mt-4">
            <CategoriesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
