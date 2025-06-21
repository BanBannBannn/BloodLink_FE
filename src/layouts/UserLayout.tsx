import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthProvider>
        <NavBar />
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default UserLayout;
