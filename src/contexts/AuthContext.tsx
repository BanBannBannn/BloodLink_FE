import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, removeToken, getToken } from "../api/apiClient";
import { getUserInfo } from "@/api/userApi";

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
};

type AuthContextType = {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("userId", user.id);
  };

  const logout = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem("userId");
    navigate("/login");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = getToken();
        const userId = localStorage.getItem("userId");
        if (token && userId) {
          const response = await getUserInfo(userId);
          setUser(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
