import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  Users,
  Wrench,
  History,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard tổng quan",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Danh sách thiết bị",
    path: "/devices",
    icon: <Settings size={20} />,
  },
  { label: "Lập lịch bảo trì", path: "/schedule", icon: <Wrench size={20} /> },
  {
    label: "Phiếu công việc",
    path: "/work-orders",
    icon: <ClipboardList size={20} />,
  },
  { label: "Nhân sự bảo trì", path: "/technicians", icon: <Users size={20} /> },
  {
    label: "Vật tư - phụ tùng",
    path: "/materials",
    icon: <Package size={20} />,
  },
  {
    label: "Lịch sử và nhật ký bảo trì",
    path: "/maintenance-history",
    icon: <History size={20} />,
  },
  {
    label: "Phân tích chi phí",
    path: "/cost-analysis",
    icon: <BarChart3 size={20} />,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-white to-blue-50 border-r border-blue-100 fixed shadow-xl">
      <div className="px-6 py-5 text-2xl font-bold text-indigo-600 tracking-tight">
        🛠 CMMS
        <p className="text-sm text-black">
          Computerized Maintenance Management System
        </p>
      </div>
      <nav className="flex flex-col gap-1 px-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-all font-medium ${
                isActive
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-indigo-100"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
