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
    <header className="h-16 bg-white shadow px-6 flex items-center justify-between">
      <h1 className="text-xl">Computerized Maintenance Management System</h1>
      {token ? (
        <button
          onClick={handleLogout}
          className="bg-[#615FFF] px-5 py-2 text-white text-sm rounded-md hover:bg-[#4B47D1] cursor-pointer"
        >
          Đăng xuất
        </button>
      ) : (
        <>
          <span>{localStorage.getItem("user.fullname")}</span>
          <Link
            to="/login"
            className="bg-[#615FFF] px-5 py-2 text-white text-sm rounded-md hover:bg-[#4B47D1]"
          >
            Đăng nhập
          </Link>
        </>
      )}
    </header>
  );
}
