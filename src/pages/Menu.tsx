
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { MenuItem, CategoryType } from "@/types";
import { Loader2, Plus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

// This is a placeholder function that would be replaced with actual API calls
// when integrating with Supabase
const fetchMenuItems = async (): Promise<MenuItem[]> => {
  // In a real implementation, this would be fetched from Supabase
  return [
    {
      id: "1",
      name: "Pizza Margherita",
      description: "Salsa de tomate, mozzarella y albahaca",
      price: 2500,
      category: "pizzas",
      images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"],
      available: true
    },
    {
      id: "2",
      name: "Pizza Napolitana",
      description: "Salsa de tomate, mozzarella, anchoas y aceitunas",
      price: 2800,
      category: "pizzas",
      images: ["https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"],
      available: true
    },
    {
      id: "3",
      name: "Hamburguesa Clásica",
      description: "Carne, lechuga, tomate, queso y salsa especial",
      price: 2200,
      category: "hamburguesas",
      images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"],
      available: true
    },
    {
      id: "4",
      name: "Lomito Completo",
      description: "Lomo, jamón, queso, lechuga, tomate y huevo",
      price: 2500,
      category: "lomitos",
      images: ["https://images.unsplash.com/photo-1600555379765-f82335a7b1b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"],
      available: true
    },
    {
      id: "5",
      name: "Milanesa Napolitana",
      description: "Milanesa de ternera con salsa, jamón y queso",
      price: 2300,
      category: "minutas",
      images: ["https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"],
      available: true
    }
  ];
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("pizzas");
  const { addItem } = useCart();
  
  useEffect(() => {
    document.title = "Menú | Río Segundo";
  }, []);

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems,
  });

  const filteredItems = menuItems?.filter(
    (item) => item.category === activeCategory && item.available
  );

  const categories = [
    { value: "pizzas", label: "Pizzas" },
    { value: "lomitos", label: "Lomitos" },
    { value: "hamburguesas", label: "Hamburguesas" },
    { value: "minutas", label: "Minutas" },
  ];

  return (
    <MainLayout>
      <div className="pt-24 pb-20 bg-secondary min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Nuestro Menú</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra variedad de platos preparados con ingredientes de primera calidad
            </p>
          </div>

          <Tabs defaultValue="pizzas" value={activeCategory} onValueChange={(val) => setActiveCategory(val as CategoryType)}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-background">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.value} 
                    value={category.value}
                    className="px-6 py-2"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map((category) => (
              <TabsContent key={category.value} value={category.value}>
                {isLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-trattoria-red" />
                  </div>
                ) : filteredItems && filteredItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                        <div className="h-48 overflow-hidden">
                          <img
                            src={item.images[0] || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold">{item.name}</h3>
                            <span className="font-semibold text-trattoria-red">
                              ${item.price.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {item.description}
                          </p>
                          <Button 
                            onClick={() => addItem(item)}
                            className="w-full bg-trattoria-red hover:bg-trattoria-red/90"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar al carrito
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground">
                      No hay productos disponibles en esta categoría actualmente.
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
