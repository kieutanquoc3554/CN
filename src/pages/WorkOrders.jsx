import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { PencilIcon } from "lucide-react";
import UpdateWorkOrderModal from "../components/UpdateWorkOrderModal";

export default function WorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchWorkOrders();
    fetchTechnicians();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/work-orders`
      );
      setWorkOrders(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth`);
      setTechnicians(res.data);
    } catch (err) {
      console.error("Fetch technicians error:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-gray-200 text-gray-500";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusTitle = (status) => {
    switch (status) {
      case "Pending":
        return "Đang chờ xét duyệt";
      case "In Progress":
        return "Đang thực hiện";
      case "Completed":
        return "Đã hoàn thành";
      default:
        return "Chưa rõ tình trạng";
    }
  };

  const filteredOrders = workOrders.filter(
    (wo) =>
      wo.device_name?.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus ? wo.status === filterStatus : true)
  );

  const assignTechnician = async (workOrderId) => {
    const technicianId = selectedTechs[workOrderId];
    if (!technicianId) return toast.warning("Vui lòng chọn kỹ thuật viên!");

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/work-orders/assign/${workOrderId}`,
        {
          technician: technicianId,
          work_order_id: workOrderId,
        }
      );
      toast.success("Phân công thành công!");
      fetchWorkOrders();
    } catch (err) {
      console.error("Assign error:", err);
      toast.error(
        `Lỗi khi phân công! - Mã nhân viên: ${technicianId} - Mã phiếu giao việc: ${workOrderId}`
      );
    }
  };

  const handleOpenUpdate = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseUpdate = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800">Phiếu công việc</h2>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          className="rounded-xl px-4 py-2 w-64 bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tìm kiếm thiết bị"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl px-4 py-2 bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Pending">Đang chờ xét duyệt</option>
          <option value="In Progress">Đang thực hiện</option>
          <option value="Completed">Đã hoàn thành</option>
        </select>

        <button
          onClick={fetchWorkOrders}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition"
        >
          Làm mới
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto bg-white shadow rounded-2xl">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-6 py-4">STT</th>
              <th className="text-left px-6 py-4">Thiết bị</th>
              <th className="text-left px-6 py-4">Loại bảo trì</th>
              <th className="text-left px-6 py-4">Ngày bắt đầu</th>
              <th className="text-left px-6 py-4">Ngày kết thúc</th>
              <th className="text-left px-6 py-4">Người phụ trách</th>
              <th className="text-left px-6 py-4">Trạng thái</th>
              <th className="text-left px-6 py-4">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((wo, index) => (
                <tr key={wo.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{wo.device_name}</td>
                  <td className="px-6 py-4">{wo.maintenance_type_name}</td>
                  <td className="px-6 py-4">
                    {moment(wo.start_time).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-6 py-4">
                    {wo.end_time || "Không xác định"}
                  </td>
                  <td className="px-6 py-4">
                    {wo.technician_name || (
                      <div className="flex items-center gap-2">
                        <select
                          className="rounded-lg px-3 py-1 bg-gray-50 shadow-sm"
                          onChange={(e) =>
                            setSelectedTechs({
                              ...selectedTechs,
                              [wo.id]: e.target.value,
                            })
                          }
                          value={selectedTechs[wo.id] || ""}
                        >
                          <option value="">-- Chọn kỹ thuật viên --</option>
                          {technicians.map((tech) => (
                            <option key={tech.user_id} value={tech.user_id}>
                              {tech.fullname}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => assignTechnician(wo.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-xl shadow transition"
                        >
                          Giao việc
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        wo.status
                      )}`}
                    >
                      {getStatusTitle(wo.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition"
                      onClick={() => handleOpenUpdate(wo)}
                    >
                      <PencilIcon className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center px-6 py-10 text-gray-500"
                >
                  Không tìm thấy phiếu công việc nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedOrder && (
          <UpdateWorkOrderModal
            workOrder={selectedOrder}
            onClose={handleCloseUpdate}
            onUpdated={fetchWorkOrders}
          />
        )}
      </div>
    </div>
  );
}
