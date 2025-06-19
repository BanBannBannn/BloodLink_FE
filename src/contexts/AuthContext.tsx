import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, removeToken } from "../api/apiClient";

type User = {
  id: string;
  fullName: string;
  email: string;
  address: string;
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
  };

  const logout = () => {
    setUser(null);
    removeToken();
    navigate("/login");
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     setUser({
  //       id: "1",
  //       name: "John Doe",
  //       email: "john.doe@example.com",
  //       role: "admin",
  //     });
  //   }
  // }, []);

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
