
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { name: "Inicio", href: "/" },
  { name: "Menú", href: "/menu" },
  { name: "Contacto", href: "/contacto" },
  { name: "Admin", href: "/admin" }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const { items } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isHomePage = pathname === "/";
  const shouldBeTransparent = isHomePage && !isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        shouldBeTransparent ? "nav-transparent" : "nav-solid"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="flex items-center">
          <span className="font-serif text-xl md:text-2xl font-bold">Río Segundo</span>
          <span className="font-serif text-sm md:text-base italic ml-1">Pizzeria & Café</span>
        </NavLink>

        {isMobile ? (
          <div className="flex items-center gap-4">
            <NavLink to="/carrito" className="relative">
              <ShoppingCart size={24} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-trattoria-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </NavLink>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-10">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "text-lg px-2 py-1 rounded-md transition-colors",
                          isActive
                            ? "font-medium text-trattoria-red"
                            : "text-foreground hover:text-trattoria-red"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <nav className="flex gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "px-2 py-1 rounded-md transition-colors",
                      isActive
                        ? "font-medium text-trattoria-red"
                        : shouldBeTransparent
                          ? "text-white hover:text-white/80"
                          : "text-foreground hover:text-trattoria-red"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <NavLink to="/carrito" className="relative">
              <ShoppingCart size={24} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-trattoria-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
