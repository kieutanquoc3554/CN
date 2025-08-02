import { useEffect, useState } from "react";
import axios from "axios";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import CreateScheduleModal from "../components/CreateScheduleModal";
import moment from "moment";
import { toast } from "react-toastify";

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null); // ← NEW

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/schedules`
      );
      setSchedules(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy lịch bảo trì", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xoá lịch này?");
    if (!confirm) return;
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/schedules/${id}`);
      fetchSchedules();
    } catch (err) {
      console.error("Xoá thất bại:", err);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setEditingSchedule(null);
    setShowModal(false);
  };

  const handleProgressChange = async (id, newProgress) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/schedules/status/${id}`,
        { progress_step: newProgress }
      );
      toast.success("Cập nhật thành công!");
      fetchSchedules();
    } catch (error) {
      console.error("Cập nhật tiến độ thất bại", error);
      alert("Cập nhật tiến độ thất bại");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const viScheduleType = {
    Time: "Thời gian",
    Usage: "Vận hành",
  };

  const viFrequencyUnit = {
    Day: "Ngày",
    Month: "Tháng",
    Quarter: "Quý",
    Hour: "Giờ",
    Product: "Sản phẩm",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Lập lịch bảo trì
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow transition"
        >
          <PlusIcon className="w-5 h-5" />
          Thêm mới
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="text-gray-600 bg-gray-100">
            <tr>
              <th className="p-4 font-semibold">Thiết bị</th>
              <th className="p-4 font-semibold">Loại bảo trì</th>
              <th className="p-4 font-semibold">Lịch trình</th>
              <th className="p-4 font-semibold">Hạn kế tiếp</th>
              <th className="p-4 font-semibold">Tiến độ</th>
              <th className="p-4 font-semibold text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="p-4">{item.device_name}</td>
                <td className="p-4">{item.maintenance_type_name}</td>
                <td className="p-4">
                  {viScheduleType[item.schedule_type] || item.schedule_type}:{" "}
                  {item.frequency_value}{" "}
                  {viFrequencyUnit[item.frequency_unit] || item.frequency_unit}
                </td>
                <td className="p-4">
                  {moment(item.next_due_date).format("DD/MM/YYYY") || "-"}
                </td>
                <td className="p-4">
                  <select
                    value={item.progress_step || ""}
                    onChange={(e) =>
                      handleProgressChange(item.id, e.target.value)
                    }
                    className="px-3 py-1 rounded-lg bg-gray-50 text-gray-700 border border-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Chờ duyệt">Chờ duyệt</option>
                    <option value="Đã duyệt">Đã duyệt</option>
                    <option value="Đã phân công">Đã phân công</option>
                    <option value="Đang chuẩn bị vật tư">
                      Đang chuẩn bị vật tư
                    </option>
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Chờ nghiệm thu">Chờ nghiệm thu</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Hoãn">Hoãn</option>
                    <option value="Hủy bỏ">Hủy bỏ</option>
                  </select>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600 hover:text-indigo-800 transition"
                    title="Chỉnh sửa"
                  >
                    <PencilIcon className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 ml-3 transition"
                    title="Xoá"
                  >
                    <TrashIcon className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {schedules.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  Không tìm thấy lịch bảo trì
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CreateScheduleModal
          onClose={handleModalClose}
          onCreated={fetchSchedules}
          schedule={editingSchedule}
        />
      )}
    </div>
  );
}
