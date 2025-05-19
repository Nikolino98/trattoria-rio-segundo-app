
import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("admin-auth") === "true"
  );
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    // Simple authentication for now - in a real app, this would be replaced with Supabase auth
    if (username === "admin2252" && password === "admin2252") {
      setIsAuthenticated(true);
      localStorage.setItem("admin-auth", "true");
      toast.success("Inicio de sesión exitoso");
      return true;
    } else {
      toast.error("Credenciales inválidas");
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin-auth");
    navigate("/admin");
    toast.info("Sesión cerrada");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
