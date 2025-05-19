
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, ImageIcon, X } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  image_urls: string[];
}

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem;
}

export default function ImageUploadDialog({ isOpen, onClose, menuItem }: ImageUploadDialogProps) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateImageUrlsMutation = useMutation({
    mutationFn: async (imageUrls: string[]) => {
      const { error } = await supabase
        .from("menu_items")
        .update({ image_urls: imageUrls })
        .eq("id", menuItem.id);

      if (error) throw error;
      return imageUrls;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
    onError: (error) => {
      console.error("Error updating image URLs:", error);
      toast.error("Error al actualizar las imágenes");
    }
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("menu-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("menu-images")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Update the menu item with the new image URL
      const updatedImageUrls = [...(menuItem.image_urls || []), publicUrl];
      await updateImageUrlsMutation.mutateAsync(updatedImageUrls);
      
      toast.success("Imagen subida correctamente");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error al subir la imagen");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      // Extract the file name from the URL
      const fileName = imageUrl.split("/").pop() || "";
      
      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from("menu-images")
        .remove([fileName]);

      if (deleteError) {
        console.error("Error deleting from storage:", deleteError);
        // Continue anyway to update the database
      }

      // Update the menu item to remove the image URL
      const updatedImageUrls = menuItem.image_urls.filter(url => url !== imageUrl);
      await updateImageUrlsMutation.mutateAsync(updatedImageUrls);
      
      toast.success("Imagen eliminada correctamente");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error al eliminar la imagen");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Imágenes de {menuItem.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
              
              {isUploading ? (
                <div className="space-y-2">
                  <p>Subiendo imagen...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline" 
                    className="mb-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" /> Seleccionar imagen
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG o GIF. Max 5MB.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">Imágenes actuales</h3>
            
            {menuItem.image_urls && menuItem.image_urls.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {menuItem.image_urls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={url} 
                      alt={`${menuItem.name} ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteImage(url)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-50 rounded-md">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="mx-auto h-8 w-8 mb-1" />
                  <p>No hay imágenes</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
