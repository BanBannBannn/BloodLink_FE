import { getUserInfo } from "@/api/userApi";
import { createContext, useContext, useEffect, useState } from "react";
import { getToken, removeToken, setToken } from "../api/apiClient";

type User = {
  id: string;
  fullName: string;
  email: string;
  addresss: string;
  backUrlIdentity: string;
  frontUrlIdentity: string;
  identityId: string;
  phoneNo: string;
  status: string;
  roleName: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("userId", user.id);
  };

  const logout = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem("userId");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = getToken();
        const userId = localStorage.getItem("userId");
        
        if (!token || !userId) {
          setLoading(false);
          return;
        }

        const response = await getUserInfo(userId);
        if (response.data) {
          setUser(response.data);
        } else {
          // If no user data, clear the stored credentials
          logout();
        }
      } catch (error) {
        console.error("Auth error:", error);
        // On error, clear the stored credentials
        logout();
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
