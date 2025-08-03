import { useEffect, useState } from "react";
import useDevices from "../hooks/api/useDevices";
import DeviceDetailModal from "../components/DeviceDetailModal";
import axios from "axios";
import AddDeviceForm from "../components/AddDeviceForm";
import { Eye } from "lucide-react";

export default function Devices() {
  const { devices, loading, error, fetchDevices } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [openAddDeviceForm, setOpenAddDeviceForm] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!selectedId) return;
    const fetchDeviceDetail = async () => {
      try {
        setDetailLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/devices/${selectedId}`
        );
        setSelectedDevice(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết thiết bị:", err);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDeviceDetail();
  }, [selectedId]);

  const closeModal = () => {
    setSelectedId(null);
    setSelectedDevice(null);
  };

  const filteredDevices =
    filter === "All"
      ? devices
      : devices.filter((d) => d.priority_level === filter);

  const renderDeviceStatus = (status) => {
    const statusName = {
      Active: "Đang hoạt động",
      Maintenance: "Đang bảo trì",
      Expired: "Quá hạn",
    };
    const text = statusName[status] || "Chưa cập nhật";
    return <span>{text}</span>;
  };

  const renderPriorityBadge = (priority) => {
    const colorMap = {
      High: "bg-red-500",
      Medium: "bg-yellow-500",
      Low: "bg-green-500",
    };
    const labelMap = {
      High: "Cao",
      Medium: "Trung bình",
      Low: "Thấp",
    };
    const color = colorMap[priority] || "bg-gray-400";
    const label = labelMap[priority] || "Không rõ";
    return (
      <span
        className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${color}`}
      >
        {label}
      </span>
    );
  };

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;
  if (error) return <p className="p-6 text-red-500">Lỗi: {error.message}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header + nút thêm */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Danh sách thiết bị</h2>
        <button
          onClick={() => setOpenAddDeviceForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm shadow cursor-pointer w-full sm:w-auto"
        >
          + Thêm thiết bị
        </button>
      </div>

      {/* Tabs lọc */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-5">
        {["All", "High", "Medium", "Low"].map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
              filter === level
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {level === "All"
              ? "Tất cả"
              : level === "High"
              ? "Ưu tiên cao"
              : level === "Medium"
              ? "Ưu tiên TB"
              : "Ưu tiên thấp"}
          </button>
        ))}
      </div>

      {/* Bảng thiết bị */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
          <thead className="text-xs uppercase text-gray-600 bg-gray-50">
            <tr>
              <th className="px-4 py-3">STT</th>
              <th className="px-4 py-3">Tên thiết bị</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Tình trạng</th>
              <th className="px-4 py-3">Ưu tiên</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((device, index) => (
              <tr
                key={device.id}
                className="bg-white hover:bg-gray-50 transition rounded-xl"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-semibold">{device.name}</td>
                <td className="px-4 py-3">{device.model || "Chưa cập nhật"}</td>
                <td className="px-4 py-3">
                  {renderDeviceStatus(device.status)}
                </td>
                <td className="px-4 py-3">
                  {renderPriorityBadge(device.priority_level)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedId(device.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg"
                  >
                    <Eye size={14} /> Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết */}
      {selectedDevice && (
        <DeviceDetailModal device={selectedDevice} onClose={closeModal} />
      )}

      {/* Form thêm mới */}
      {openAddDeviceForm && (
        <AddDeviceForm
          setOpenAddDeviceForm={setOpenAddDeviceForm}
          fetch={fetchDevices}
        />
      )}
    </div>
  );
}
