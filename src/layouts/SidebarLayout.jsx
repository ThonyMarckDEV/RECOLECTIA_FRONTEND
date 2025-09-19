import React from "react";
import Sidebar from "../components/Shared/SideBar";
import { Outlet } from "react-router-dom";

const SidebarLayout = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 px-10 py-10">
        {/* Aquí se renderizan las rutas hijas */}
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;