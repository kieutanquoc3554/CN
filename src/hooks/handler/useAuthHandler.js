import axios from "axios";

export default function useAuthHandler() {
  const URL = import.meta.env.VITE_SERVER_URL;
  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${URL}/auth/login`, {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi đăng nhập, vui lòng thử lại",
      };
    }
  };

  return { handleLogin };
}
