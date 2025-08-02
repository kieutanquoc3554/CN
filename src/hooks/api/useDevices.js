import { useEffect, useState } from "react";
import axios from "axios";

export default function useDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/devices`);
      setDevices(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return { devices, loading, error, fetchDevices };
}
