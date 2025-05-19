
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useCart } from "@/hooks/use-cart";
import { DeliveryDetails } from "@/types";

export default function Carrito() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, setDeliveryDetails } = useCart();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [cashAmount, setCashAmount] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Carrito | Río Segundo";
  }, []);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    setStep("checkout");
  };

  const handlePlaceOrder = () => {
    if (deliveryType === "delivery" && !address) {
      toast.error("Por favor ingresa una dirección de entrega");
      return;
    }
    
    if (paymentMethod === "cash" && !cashAmount) {
      toast.error("Por favor ingresa con cuánto vas a abonar");
      return;
    }

    const orderDetails: DeliveryDetails = {
      type: deliveryType,
      notes,
      paymentMethod,
      ...(deliveryType === "delivery" && { address }),
      ...(paymentMethod === "cash" && { cashAmount: parseFloat(cashAmount) })
    };

    setDeliveryDetails(orderDetails);
    
    // This would be replaced with actual order submission logic
    // when integrating with Supabase and MercadoPago
    toast.success("¡Pedido recibido!");
    clearCart();
    navigate("/");
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  if (items.length === 0 && step === "cart") {
    return (
      <MainLayout>
        <div className="pt-24 pb-20 bg-secondary min-h-screen">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-3">Tu Carrito</h1>
              <p className="text-muted-foreground">Tu carrito está vacío</p>
            </div>
            
            <div className="flex justify-center">
              <div className="text-center p-12 bg-white rounded-lg shadow-md">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-bold mb-3">No hay productos en tu carrito</h2>
                <p className="text-muted-foreground mb-6">
                  Explora nuestro menú y agrega algunos productos
                </p>
                <Button asChild className="bg-trattoria-red hover:bg-trattoria-red/90">
                  <a href="/menu">Ir al Menú</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-20 bg-secondary min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">
              {step === "cart" ? "Tu Carrito" : "Finalizar Compra"}
            </h1>
            <p className="text-muted-foreground">
              {step === "cart" 
                ? `${totalItems} producto${totalItems !== 1 ? "s" : ""} en tu carrito`
                : "Completa tus datos para finalizar la compra"
              }
            </p>
          </div>
          
          {step === "cart" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center py-4 border-b last:border-0">
                      <div className="flex-shrink-0 w-20 h-20 bg-secondary rounded-md overflow-hidden">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-muted-foreground text-xs">Sin imagen</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toLocaleString()} c/u
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="ml-6 text-right">
                        <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-muted-foreground hover:text-destructive flex items-center mt-1"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-bold mb-4">Resumen del Pedido</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span>A calcular</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${subtotal().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full bg-trattoria-red hover:bg-trattoria-red/90"
                  >
                    Finalizar Compra
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-bold mb-4">Datos de Entrega</h2>
                  
                  <div className="space-y-6">
                    {/* Delivery Type */}
                    <div>
                      <Label className="text-base font-medium mb-2 block">
                        Tipo de Entrega
                      </Label>
                      <RadioGroup 
                        value={deliveryType} 
                        onValueChange={(value) => setDeliveryType(value as "pickup" | "delivery")}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pickup" id="pickup" />
                          <Label htmlFor="pickup" className="font-normal cursor-pointer">
                            Retirar en el local
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="delivery" id="delivery" />
                          <Label htmlFor="delivery" className="font-normal cursor-pointer">
                            Envío a domicilio
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {/* Address (only for delivery) */}
                    {deliveryType === "delivery" && (
                      <div>
                        <Label htmlFor="address" className="text-base font-medium mb-2 block">
                          Dirección de Entrega
                        </Label>
                        <Input 
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Calle, número, piso, departamento"
                          required
                        />
                      </div>
                    )}
                    
                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes" className="text-base font-medium mb-2 block">
                        Comentarios (opcional)
                      </Label>
                      <Textarea 
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Instrucciones especiales, referencias, etc."
                      />
                    </div>
                    
                    {/* Payment Method */}
                    <div>
                      <Label className="text-base font-medium mb-2 block">
                        Método de Pago
                      </Label>
                      <RadioGroup 
                        value={paymentMethod} 
                        onValueChange={(value) => setPaymentMethod(value as "card" | "cash")}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="font-normal cursor-pointer">
                            Tarjeta (MercadoPago)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="font-normal cursor-pointer">
                            Efectivo
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {/* Cash Amount (only for cash payment) */}
                    {paymentMethod === "cash" && (
                      <div>
                        <Label htmlFor="cashAmount" className="text-base font-medium mb-2 block">
                          ¿Con cuánto vas a abonar?
                        </Label>
                        <Input 
                          id="cashAmount"
                          type="number"
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          placeholder="Monto en efectivo"
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-bold mb-4">Resumen del Pedido</h2>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Productos ({totalItems})</h3>
                    <ul className="space-y-2 text-sm">
                      {items.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span>A calcular</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${subtotal().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={handlePlaceOrder} 
                      className="w-full bg-trattoria-red hover:bg-trattoria-red/90"
                    >
                      Confirmar Pedido
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setStep("cart")} 
                      className="w-full"
                    >
                      Volver al Carrito
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
