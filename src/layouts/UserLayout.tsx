import NavBar from "@/components/NavBar";
import React from "react";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <>
      <NavBar />
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default UserLayout;
