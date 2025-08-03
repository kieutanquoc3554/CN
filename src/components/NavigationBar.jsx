import { Link, useNavigate } from "react-router-dom";

export default function NavigationBar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white shadow px-4 md:px-6 flex items-center justify-between flex-wrap">
      <h1 className="text-base md:text-xl font-semibold text-gray-800">
        CMMS
        <span className="hidden sm:inline ml-1 text-sm text-gray-500">
          – Computerized Maintenance Management System
        </span>
      </h1>

      {token ? (
        <div className="flex items-center gap-3 md:gap-5 mt-2 md:mt-0">
          <strong className="hidden sm:inline text-sm text-blue-800 truncate max-w-[120px] md:max-w-none">
            {JSON.parse(localStorage.getItem("user"))?.fullname}
          </strong>
          <button
            onClick={handleLogout}
            className="bg-[#615FFF] px-4 md:px-5 py-1.5 md:py-2 text-white text-sm rounded-md hover:bg-[#4B47D1]"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="bg-[#615FFF] px-4 md:px-5 py-1.5 md:py-2 text-white text-sm rounded-md hover:bg-[#4B47D1] mt-2 md:mt-0"
        >
          Đăng nhập
        </Link>
      )}
    </header>
  );
}
