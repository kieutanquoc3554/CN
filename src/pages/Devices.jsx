import { useEffect, useState } from "react";
import useDevices from "../hooks/api/useDevices";
import DeviceDetailModal from "../components/DeviceDetailModal";
import UpdateDeviceForm from "../components/UpdateDeviceForm";
import axios from "axios";
import AddDeviceForm from "../components/AddDeviceForm";
import { Eye, Pencil } from "lucide-react";

export default function Devices() {
  const { devices, loading, error, fetchDevices } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDeviceUpdate, setSelectedDeviceUpdate] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [openAddDeviceForm, setOpenAddDeviceForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 10;

  // Fetch device detail
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

  // Fetch device for update
  useEffect(() => {
    if (!selectedDeviceUpdate) return;
    const fetchDeviceDetail = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/devices/${selectedDeviceUpdate}`
        );
        setSelectedDeviceUpdate(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thiết bị cập nhật:", err);
      }
    };
    fetchDeviceDetail();
  }, [selectedDeviceUpdate]);

  const closeModal = () => {
    setSelectedId(null);
    setSelectedDevice(null);
  };

  // Filter, search and sort
  const filteredDevices =
    filter === "All"
      ? devices
      : devices.filter((d) => d.priority_level === filter);

  const searchedDevices = filteredDevices.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDevices = [...searchedDevices].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const paginatedDevices = sortedDevices.slice(
    (currentPage - 1) * devicesPerPage,
    currentPage * devicesPerPage
  );

  const totalPages = Math.ceil(sortedDevices.length / devicesPerPage);

  const renderDeviceStatus = (status) => {
    const statusName = {
      Active: "Đang hoạt động",
      Maintenance: "Đang bảo trì",
      Expired: "Quá hạn",
    };
    return <span>{statusName[status] || "Chưa cập nhật"}</span>;
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
    return (
      <span
        className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
          colorMap[priority] || "bg-gray-400"
        }`}
      >
        {labelMap[priority] || "Không rõ"}
      </span>
    );
  };

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;
  if (error) return <p className="p-6 text-red-500">Lỗi: {error.message}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Danh sách thiết bị</h2>
        <button
          onClick={() => setOpenAddDeviceForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm shadow w-full sm:w-auto"
        >
          + Thêm thiết bị
        </button>
      </div>

      {/* Tabs lọc */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-5">
        {["All", "High", "Medium", "Low"].map((level) => (
          <button
            key={level}
            onClick={() => {
              setFilter(level);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
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

      {/* Search input */}
      <input
        type="text"
        placeholder="Tìm kiếm theo tên thiết bị..."
        className="px-4 py-2 border rounded-lg w-full sm:w-80 mb-4"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
          <thead className="text-xs uppercase text-gray-600 bg-gray-50">
            <tr>
              <th className="px-4 py-3">STT</th>
              <th className="px-4 py-3">Tên thiết bị (A-Z)</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Tình trạng</th>
              <th className="px-4 py-3">Ưu tiên</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDevices.map((device, index) => (
              <tr
                key={device.id}
                className="bg-white hover:bg-gray-50 transition rounded-xl"
              >
                <td className="px-4 py-3">
                  {(currentPage - 1) * devicesPerPage + index + 1}
                </td>
                <td className="px-4 py-3 font-semibold">{device.name}</td>
                <td className="px-4 py-3">{device.model || "Chưa cập nhật"}</td>
                <td className="px-4 py-3">
                  {renderDeviceStatus(device.status)}
                </td>
                <td className="px-4 py-3">
                  {renderPriorityBadge(device.priority_level)}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => setSelectedId(device.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg"
                  >
                    <Eye size={14} /> Xem
                  </button>
                  <button
                    onClick={() => setSelectedDeviceUpdate(device.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-green-700 hover:bg-green-600 text-white text-xs rounded-lg"
                  >
                    <Pencil size={14} /> Cập nhật
                  </button>
                </td>
              </tr>
            ))}
            {paginatedDevices.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Không tìm thấy thiết bị nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal detail */}
      {selectedDevice && (
        <DeviceDetailModal device={selectedDevice} onClose={closeModal} />
      )}

      {/* Add form */}
      {openAddDeviceForm && (
        <AddDeviceForm
          setOpenAddDeviceForm={setOpenAddDeviceForm}
          fetch={fetchDevices}
        />
      )}

      {/* Update form */}
      {selectedDeviceUpdate && (
        <UpdateDeviceForm
          initialData={selectedDeviceUpdate}
          onClose={() => setSelectedDeviceUpdate(null)}
          fetch={fetchDevices}
        />
      )}
    </div>
  );
}
