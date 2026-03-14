import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const userData = response.data.user;
      
      // 1. setUser: อัปเดต State ใน Memory เพื่อให้ Component ต่างๆ (เช่น Navbar) เปลี่ยนการแสดงผลทันที
      setUser(userData);
      
      // 2. localStorage: เก็บข้อมูลลง Browser Storage เพื่อให้เวลา Refresh หน้าเว็บ ข้อมูลจะไม่หายไป
      localStorage.setItem("user", JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {

      console.error("Login failed:", error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Ideally call a backend logout route to clear the cookie
  };

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
