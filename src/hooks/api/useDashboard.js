// hooks/api/useDashboard.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/dashboard`
        );
        setData(res.data);
      } catch (error) {
        console.error("Dashboard API error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return { data, loading };
}
