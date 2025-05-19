
import { NavLink } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-trattoria-charcoal text-white">
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl mb-4">Río Segundo</h3>
            <p className="text-gray-300 mb-4">
              Pizzería & Café con los mejores sabores tradicionales de Italia en un ambiente moderno y acogedor.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:text-trattoria-red transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-trattoria-red transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-xl mb-4">Enlaces</h3>
            <ul className="space-y-2">
              {[
                { name: "Inicio", href: "/" },
                { name: "Menú", href: "/menu" },
                { name: "Contacto", href: "/contacto" },
              ].map((item) => (
                <li key={item.name}>
                  <NavLink 
                    to={item.href} 
                    className="text-gray-300 hover:text-trattoria-red transition-colors"
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-xl mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span className="text-gray-300">Av. San Martín 123, Río Segundo, Córdoba</span>
              </li>
              <li className="flex gap-2">
                <Phone size={18} className="shrink-0" />
                <a href="tel:+5493514123456" className="text-gray-300 hover:text-trattoria-red transition-colors">
                  +54 9 351 412-3456
                </a>
              </li>
              <li className="flex gap-2">
                <Mail size={18} className="shrink-0" />
                <a href="mailto:info@riosegundo.com" className="text-gray-300 hover:text-trattoria-red transition-colors">
                  info@riosegundo.com
                </a>
              </li>
              <li className="flex gap-2">
                <Clock size={18} className="shrink-0 mt-0.5" />
                <div className="text-gray-300">
                  <p>Lun - Jue: 11:30 - 23:00</p>
                  <p>Vie - Dom: 11:30 - 00:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Río Segundo Pizzeria & Café. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
