import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/maintenance-history`) // chỉnh route API nếu cần
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Lịch sử bảo trì
      </h2>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Thiết bị</th>
                <th className="px-6 py-4 text-left">Phiếu công việc</th>
                <th className="px-6 py-4 text-left">Kỹ thuật viên</th>
                <th className="px-6 py-4 text-left">Ngày bảo trì</th>
                <th className="px-6 py-4 text-left">Trạng thái</th>
                <th className="px-6 py-4 text-left">Tình trạng sau</th>
                <th className="px-6 py-4 text-left">Sự cố thường gặp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
              {history.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{item.name || "N/A"}</td>
                  <td className="px-6 py-4">{item.work_order_id}</td>
                  <td className="px-6 py-4">{item.fullname || "N/A"}</td>
                  <td className="px-6 py-4">
                    {moment(item.maintenance_date).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.condition_after}</td>
                  <td className="px-6 py-4">{item.common_issues}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
