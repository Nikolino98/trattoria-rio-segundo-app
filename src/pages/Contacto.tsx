
import { useEffect } from "react";
import { Phone, MapPin, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/layout/MainLayout";

export default function Contacto() {
  useEffect(() => {
    document.title = "Contacto | Río Segundo";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be replaced with actual form submission logic
    // when integrating with Supabase
    console.log("Form submitted");
  };

  return (
    <MainLayout>
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Contacto</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ¿Tienes alguna pregunta o comentario? Estamos aquí para ayudarte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="text-trattoria-red mr-3 h-5 w-5 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Dirección</h3>
                      <p className="text-muted-foreground">
                        Av. San Martín 123, Río Segundo<br />
                        Córdoba, Argentina
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-trattoria-red mr-3 h-5 w-5 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Teléfono</h3>
                      <p className="text-muted-foreground">
                        <a href="tel:+5493514123456" className="hover:text-trattoria-red transition-colors">
                          +54 9 351 412-3456
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="text-trattoria-red mr-3 h-5 w-5 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-muted-foreground">
                        <a href="mailto:info@riosegundo.com" className="hover:text-trattoria-red transition-colors">
                          info@riosegundo.com
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="text-trattoria-red mr-3 h-5 w-5 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Horarios</h3>
                      <div className="text-muted-foreground">
                        <p>Lunes a Jueves: 11:30 - 23:00</p>
                        <p>Viernes a Domingo: 11:30 - 00:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input id="name" placeholder="Tu nombre" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="tu@email.com" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto</Label>
                    <Input id="subject" placeholder="Asunto de tu mensaje" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea id="message" placeholder="Tu mensaje" rows={5} required />
                  </div>
                  
                  <Button type="submit" className="w-full bg-trattoria-red hover:bg-trattoria-red/90">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </Button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Google Maps */}
          <div className="mt-12">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe 
                title="Ubicación de Río Segundo Pizzeria"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.4973950979794!2d-64.11619492395869!3d-31.405518496791867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a28e927e91d9%3A0x99d99920479628de!2sC%C3%B3rdoba%2C%20Argentina!5e0!3m2!1sen!2sus!4v1716153168573!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
