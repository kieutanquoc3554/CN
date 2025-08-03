import { Outlet } from "react-router-dom";
import "../App.css";
import Sidebar from "../components/Sidebar";
import NavigationBar from "./NavigationBar";

export default function AppLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-20 md:ml-64 flex-1 bg-gray-50 min-h-screen transition-all">
        <NavigationBar />
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
