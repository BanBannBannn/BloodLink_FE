import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;
