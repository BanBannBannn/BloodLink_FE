import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="grow overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
