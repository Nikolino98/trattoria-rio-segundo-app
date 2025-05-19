
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  created_at: string;
}

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CategoryDialog({ isOpen, onClose, category }: CategoryDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!category;
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  const saveCategoryMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      setIsSaving(true);
      
      if (isEditing && category) {
        // Update existing category
        const { data, error } = await supabase
          .from("categories")
          .update({ name: values.name })
          .eq("id", category.id)
          .select();

        if (error) throw error;
        return data[0];
      } else {
        // Create new category
        const { data, error } = await supabase
          .from("categories")
          .insert({ name: values.name })
          .select();

        if (error) throw error;
        return data[0];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(isEditing ? "Categoría actualizada" : "Categoría creada");
      onClose();
    },
    onError: (error) => {
      console.error("Error saving category:", error);
      toast.error(isEditing ? "Error al actualizar la categoría" : "Error al crear la categoría");
    },
    onSettled: () => {
      setIsSaving(false);
    }
  });

  const onSubmit = (values: FormValues) => {
    saveCategoryMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la categoría" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
