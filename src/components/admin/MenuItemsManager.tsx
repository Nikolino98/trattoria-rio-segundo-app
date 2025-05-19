import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Image, Plus, ImageOff, Check, X } from "lucide-react";
import { toast } from "sonner";
import MenuItemDialog from "./MenuItemDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ImageUploadDialog from "./ImageUploadDialog";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  is_active: boolean;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
  } | null;
}

export default function MenuItemsManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [selectedItemForImage, setSelectedItemForImage] = useState<MenuItem | null>(null);
  const queryClient = useQueryClient();

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*, category:category_id(name)")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error al cargar los productos");
        throw error;
      }
      return data as MenuItem[];
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("menu_items")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;
      return { id, isActive };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success(`Producto ${data.isActive ? "activado" : "desactivado"}`);
    },
    onError: () => {
      toast.error("Error al cambiar el estado del producto");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Producto eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar el producto");
    }
  });

  const handleEdit = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageManagement = (menuItem: MenuItem) => {
    setSelectedItemForImage(menuItem);
    setIsImageDialogOpen(true);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    toggleActiveMutation.mutate({ id, isActive: !isActive });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingMenuItem(null);
  };

  const closeImageDialog = () => {
    setIsImageDialogOpen(false);
    setSelectedItemForImage(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Productos</h2>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Cargando productos...</p>
          </div>
        ) : !menuItems || menuItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay productos para mostrar</p>
            <p className="text-sm mt-2">Agrega un nuevo producto para comenzar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Imágenes</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{formatPrice(item.price)}</TableCell>
                    <TableCell>{item.category?.name || "Sin categoría"}</TableCell>
                    <TableCell>
                      {item.image_urls && item.image_urls.length > 0 ? (
                        <span className="text-green-600 flex items-center">
                          <Check className="h-4 w-4 mr-1" /> {item.image_urls.length}
                        </span>
                      ) : (
                        <span className="text-amber-600 flex items-center">
                          <ImageOff className="h-4 w-4 mr-1" /> Sin imágenes
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={item.is_active ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleActive(item.id, item.is_active)}
                      >
                        {item.is_active ? "Activo" : "Inactivo"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleImageManagement(item)}
                              >
                                <Image className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Administrar imágenes</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Eliminar</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {isDialogOpen && (
        <MenuItemDialog 
          isOpen={isDialogOpen} 
          onClose={closeDialog}
          menuItem={editingMenuItem}
        />
      )}

      {isImageDialogOpen && selectedItemForImage && (
        <ImageUploadDialog
          isOpen={isImageDialogOpen}
          onClose={closeImageDialog}
          menuItem={selectedItemForImage}
        />
      )}
    </Card>
  );
}
