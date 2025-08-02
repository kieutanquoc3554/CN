import { FaUser, FaLock } from "react-icons/fa";
import useAuthHandler from "../hooks/handler/useAuthHandler";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { handleLogin } = useAuthHandler();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const result = await handleLogin(username, password);

    if (result.success) {
      alert("Đăng nhập thành công!");
      navigate("/dashboard");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-[url('https://getwallpapers.com/wallpaper/full/8/4/8/29950.jpg')] bg-cover">
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <img
          className="h-48 w-48 mx-auto mb-5"
          src="https://companieslogo.com/img/orig/KO-b23a2a5e.png?t=1720244492"
          alt="Logo"
        />
        <h1 className="text-2xl font-bold text-white">CocaCola</h1>
        <p className="text-lg text-white font-semibold mb-6">
          Công ty Coca-Cola
        </p>
        <form className="space-y-4 text-left" onSubmit={onSubmit}>
          <div className="flex items-center border-1 border-gray-200 rounded-md px-3 py-2">
            <FaUser className="text-red-200 mr-2" />
            <input
              className="w-full outline-none text-white"
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              required
            />
          </div>
          <div className="flex items-center border-1 border-gray-200 rounded-md px-3 py-2">
            <FaLock className="text-red-200 mr-2" />
            <input
              className="w-full outline-none text-white"
              type="password"
              name="password"
              placeholder="Mật khẩu"
              required
            />
          </div>
          <button
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 cursor-pointer"
            type="submit"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
