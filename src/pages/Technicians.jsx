import { useEffect, useState } from "react";
import axios from "axios";
import { User, BadgeInfo, Wrench, Clock, Hash } from "lucide-react";

export default function Technicians() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth`);
        setTechnicians(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách kỹ thuật viên:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  const Shift = {
    Morning: "Ca sáng",
    Afternoon: "Ca chiều",
    Night: "Ca đêm",
  };

  function renderShift(shift) {
    return Shift[shift];
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <BadgeInfo className="w-6 h-6 text-blue-600" />
        Danh sách kỹ thuật viên
      </h2>

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="text-xs text-gray-500 bg-gray-50">
              <tr className="uppercase tracking-wide text-left">
                <th className="px-5 py-4 font-medium">
                  <div className="flex items-center gap-1">
                    <Hash className="w-4 h-4 text-gray-400" />
                    ID
                  </div>
                </th>
                <th className="px-5 py-4 font-medium">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4 text-gray-400" />
                    Họ tên
                  </div>
                </th>
                <th className="px-5 py-4 font-medium">
                  <div className="flex items-center gap-1">
                    <Wrench className="w-4 h-4 text-gray-400" />
                    Kỹ năng
                  </div>
                </th>
                <th className="px-5 py-4 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Ca làm
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {technicians.map((tech) => (
                <tr
                  key={tech.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-5 py-3">{tech.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {tech.fullname}
                  </td>
                  <td className="px-5 py-3">{tech.skill_set}</td>
                  <td className="px-5 py-3">{renderShift(tech.shift)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
