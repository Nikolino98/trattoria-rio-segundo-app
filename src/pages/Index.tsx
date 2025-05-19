
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function Index() {
  // Set document title
  useEffect(() => {
    document.title = "Río Segundo Pizzeria & Café";
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/50 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'darken'
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
            Río Segundo
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 font-serif italic animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
            Pizzeria & Café
          </p>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.9s' }}>
            Sabores auténticos en cada bocado, tradiciones italianas con un toque moderno
          </p>
          <div className="flex justify-center gap-4 animate-fade-in opacity-0" style={{ animationDelay: '1.2s' }}>
            <Button asChild size="lg" className="bg-trattoria-red hover:bg-trattoria-red/90">
              <NavLink to="/menu">Ver Menú</NavLink>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
              <NavLink to="/contacto">Contáctanos</NavLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nuestras Especialidades</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Pizzas Artesanales",
                description: "Elaboradas con masa madre y los mejores ingredientes frescos",
                image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Lomitos Premium",
                description: "Carne de primera calidad con combinaciones únicas",
                image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Café de Especialidad",
                description: "Granos seleccionados y preparados con la técnica perfecta",
                image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
            ].map((item, index) => (
              <div key={index} className="bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-60 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-trattoria-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestra Historia</h2>
              <p className="text-lg mb-4">
                Fundada en 2010, Río Segundo Pizzeria & Café nació de la pasión por ofrecer la auténtica cocina italiana en un ambiente acogedor y moderno.
              </p>
              <p className="text-lg mb-6">
                Utilizamos recetas tradicionales, transmitidas de generación en generación, combinadas con técnicas modernas y los ingredientes más frescos disponibles localmente.
              </p>
              <Button asChild className="bg-trattoria-red hover:bg-trattoria-red/90">
                <NavLink to="/contacto">Visítanos</NavLink>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Interior del restaurante" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
