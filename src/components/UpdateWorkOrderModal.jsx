import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdateWorkOrderModal({
  workOrder,
  onClose,
  onUpdated,
}) {
  const [formData, setFormData] = useState({
    description: workOrder.description || "",
    status: workOrder.status || "Pending",
    performed_by: workOrder.performed_by || "",
    note: workOrder.note || "",
  });
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [historyData, setHistoryData] = useState({
    device_id: workOrder.device_id,
    work_order_id: workOrder.id,
    performed_by: workOrder.performed_by,
    maintenance_date: new Date().toISOString().split("T")[0],
    status: "",
    condition_after: "",
    common_issues: "",
  });

  useEffect(() => {
    if (formData.status === "Completed") {
      setShowHistoryForm(true);
    } else {
      setShowHistoryForm(false);
    }
  }, [formData.status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/work-orders/update/${workOrder.id}`,
        formData
      );
      if (formData.status === "Completed") {
        await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/maintenance-history/${
            workOrder.id
          }`,
          {
            ...historyData,
          }
        );
      }
      toast.success("Cập nhật thành công!");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error("Cập nhật thất bại!");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-8 relative max-h-[90vh] overflow-y-auto space-y-6">
        {/* Nút đóng */}
        <button
          className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          🛠️ Cập nhật Phiếu Công Việc
        </h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Mô tả */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Mô tả công việc
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-50 p-3 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả chi tiết"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-gray-50 p-3 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">🕒 Chờ xử lý</option>
              <option value="In Progress">⚙️ Đang xử lý</option>
              <option value="Completed">✅ Hoàn thành</option>
              <option value="Cancelled">❌ Đã hủy</option>
            </select>
          </div>

          {/* Kỹ thuật viên */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Mã kỹ thuật viên phụ trách
            </label>
            <input
              type="number"
              name="performed_by"
              value={formData.performed_by}
              onChange={handleChange}
              className="w-full bg-gray-50 p-3 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mã nhân viên (ID)"
            />
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={2}
              className="w-full bg-gray-50 p-3 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Thêm ghi chú nếu cần"
            />
          </div>

          {/* Thông tin bảo trì sau hoàn thành */}
          {showHistoryForm && (
            <div className="pt-4 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Thông tin bảo trì
              </h3>

              <div>
                <label className="block font-medium text-gray-600 mb-1">
                  Ngày bảo trì
                </label>
                <input
                  type="date"
                  name="maintenance_date"
                  value={historyData.maintenance_date}
                  onChange={(e) =>
                    setHistoryData({
                      ...historyData,
                      maintenance_date: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 p-2 rounded-2xl shadow-inner"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-600 mb-1">
                  Tình trạng sau bảo trì
                </label>
                <textarea
                  name="condition_after"
                  value={historyData.condition_after}
                  onChange={(e) =>
                    setHistoryData({
                      ...historyData,
                      condition_after: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 p-2 rounded-2xl shadow-inner"
                  rows={2}
                />
              </div>

              <div>
                <label className="block font-medium text-gray-600 mb-1">
                  Lỗi thường gặp
                </label>
                <textarea
                  name="common_issues"
                  value={historyData.common_issues}
                  onChange={(e) =>
                    setHistoryData({
                      ...historyData,
                      common_issues: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 p-2 rounded-2xl shadow-inner"
                  rows={2}
                />
              </div>

              <div>
                <label className="block font-medium text-gray-600 mb-1">
                  Trạng thái sau bảo trì
                </label>
                <input
                  name="status"
                  value={historyData.status}
                  onChange={(e) =>
                    setHistoryData({ ...historyData, status: e.target.value })
                  }
                  className="w-full bg-gray-50 p-2 rounded-2xl shadow-inner"
                  placeholder="VD: Đã hoạt động tốt"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium shadow"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
