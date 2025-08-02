import axios from "axios";
import { useEffect, useState } from "react";
import { HistoryIcon, Wrench, BadgeCheck, AlertTriangle } from "lucide-react";
import moment from "moment";

export default function DeviceDetailModal({ device, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/devices/history/by-device?device_id=${device.id}`
      )
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err));
  }, [device.id]);

  if (!device) return null;
  const attributes = device.attribute || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Chi tiết thiết bị
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-medium text-gray-700">Tên:</span>{" "}
          <span className="text-blue-600 font-semibold">{device.name}</span>
        </p>

        <div className="grid grid-cols-2 gap-6 text-sm text-gray-700 mb-6">
          <div>
            <p className="mb-1">
              <span className="font-medium">Mã thiết bị:</span> {device.id}
            </p>
            <p className="mb-1">
              <span className="font-medium">Model:</span>{" "}
              {device.model || "Không rõ"}
            </p>
          </div>
          <div>
            <p className="mb-1">
              <span className="font-medium">Trạng thái:</span>{" "}
              {device.status || "Không rõ"}
            </p>
            <p className="mb-1">
              <span className="font-medium">Ưu tiên:</span>{" "}
              {device.priority_level || "Không rõ"}
            </p>
          </div>
        </div>

        {device.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Mô tả thiết bị
            </h3>
            <p className="text-sm text-gray-600">{device.description}</p>
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Thông số kỹ thuật
        </h3>

        {attributes.length > 0 ? (
          <div className="overflow-x-auto rounded-xl bg-gray-50">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-700 bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Thuộc tính</th>
                  <th className="px-4 py-2">Giá trị</th>
                </tr>
              </thead>
              <tbody>
                {attributes.map((attr, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 border-t">
                    <td className="px-4 py-2 font-medium text-gray-800">
                      {attr.attribute_name}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {attr.attribute_value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Không có thông số kỹ thuật.</p>
        )}

        <div className="mt-6 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Lịch sử bảo trì
          </h3>

          {history.length === 0 ? (
            <div className="mt-4 text-gray-500 italic">
              Chưa có lịch sử bảo trì.
            </div>
          ) : (
            <div className="overflow-x-auto mt-4 rounded-xl bg-gray-50">
              <table className="min-w-full text-sm text-left">
                <thead className="text-gray-700 bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Ngày</th>
                    <th className="px-4 py-2">Thiết bị</th>
                    <th className="px-4 py-2">Trạng thái</th>
                    <th className="px-4 py-2">Tình trạng sau</th>
                    <th className="px-4 py-2">Sự cố thường gặp</th>
                    <th className="px-4 py-2">Kỹ thuật viên</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 border-t">
                      <td className="px-4 py-2">
                        {moment(item.maintenance_date).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-4 py-2">{item.device_name}</td>
                      <td className="px-4 py-2">
                        {item.status === "Completed" ? (
                          <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                            <BadgeCheck className="w-4 h-4" />
                            Hoàn thành
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium">
                            <AlertTriangle className="w-4 h-4" />
                            Chưa xong
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">{item.condition_after}</td>
                      <td className="px-4 py-2">{item.common_issues}</td>
                      <td className="px-4 py-2">{item.technician_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Lịch vận hành
        </h3>
        <div>
          <span className="text-gray-500 italic">Đang xây dựng...</span>
        </div>
      </div>
    </div>
  );
}
