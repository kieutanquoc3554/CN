import { useEffect, useState } from "react";
import axios from "axios";

export default function CreateScheduleModal({ onClose, onCreated, schedule }) {
  const isEdit = !!schedule;
  const [form, setForm] = useState({
    device_id: schedule?.device_id || "",
    maintenance_type_id: schedule?.maintenance_type_id || "",
    schedule_type: schedule?.schedule_type || "",
    frequency_value: schedule?.frequency_value || "",
    frequency_unit: schedule?.frequency_unit || "",
    next_due_date: schedule?.next_due_date || "",
    progress_step: schedule?.progress_step || "",
    note: schedule?.note || "",
    spare_part_id: schedule?.spare_part_id || "",
  });
  const [devices, setDevices] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [spareParts, setSpareParts] = useState([]);

  const selectedType = types.find((t) => String(t.id) === selectedTypeId);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/devices`
        );
        setDevices(response.data);
      } catch (error) {
        console.log("Lỗi lấy thiết bị", error);
      }
    };
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/auth`
        );
        setTechnicians(response.data);
      } catch (error) {
        console.log("Lỗi lấy thông tin kỹ thuật viên", error);
      }
    };
    const fetchTypes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/maintenanceTypes`
        );
        setTypes(response.data);
      } catch (error) {
        console.log("Lỗi lấy thông tin loại bảo trì", error);
      }
    };
    fetchDevices();
    fetchTechnicians();
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchSpareParts = async () => {
      if (!form.device_id) {
        setSpareParts([]);
        setForm((prev) => ({ ...prev, spare_part_id: "" }));
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/spare-parts/${form.device_id}`
        );
        setSpareParts(response.data);
      } catch (error) {
        console.log("Lỗi lấy danh sách vật tư", error);
      }
    };

    fetchSpareParts();
  }, [form.device_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "maintenance_type_id") {
      setSelectedTypeId(value);
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/schedules/${schedule.id}`,
          form
        );
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/schedules`, form);
      }
      onCreated();
      onClose();
    } catch (err) {
      console.error("Lỗi khi lưu lịch bảo trì", err);
    }
  };

  const inputStyle =
    "border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl max-w-3xl w-full space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold">
          {isEdit ? "Chỉnh sửa lịch bảo trì" : "Tạo mới lịch bảo trì"}
        </h2>

        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">Thiết bị bảo trì</label>
          <select
            name="device_id"
            onChange={handleChange}
            className={inputStyle}
            value={form.device_id}
          >
            <option value="">-- Chọn thiết bị --</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">
            Vật tư cần bảo trì
          </label>
          <select
            name="spare_part_id"
            onChange={handleChange}
            className={inputStyle}
            value={form.spare_part_id}
          >
            <option value="">-- Chọn vật tư --</option>
            {spareParts.map((part) => (
              <option key={part.id} value={part.id}>
                {part.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">Loại bảo trì</label>
          <select
            name="maintenance_type_id"
            onChange={handleChange}
            className={inputStyle}
            value={form.maintenance_type_id}
          >
            <option value="">-- Chọn Loại bảo trì --</option>
            {types.map((t) => (
              <>
                <option value={t.id}>{t.name}</option>
              </>
            ))}
          </select>
          {selectedType && (
            <p className="text-sm text-gray-600 mt-1">
              ℹ️ {selectedType.description}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Loại lập lịch</label>

            <select
              value={form.schedule_type}
              name="schedule_type"
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">-- Chọn loại lập lịch --</option>
              <option value="Time">Thời gian</option>
              <option value="Usage">Vận hành</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Tần suất</label>
            <input
              value={form.frequency_value}
              type="number"
              name="frequency_value"
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
          <div className="flex-1 flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Đơn vị</label>
            <select
              value={form.frequency_unit}
              name="frequency_unit"
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">-- Chọn đơn vị --</option>
              <option value="Day">Ngày</option>
              <option value="Month">Tháng</option>
              <option value="Quarter">Quý</option>
              <option value="Hour">Giờ</option>
              <option value="Product">Sản phẩm</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">
            Hạn bảo trì kế tiếp
          </label>
          <input
            value={form.next_due_date}
            type="date"
            name="next_due_date"
            onChange={handleChange}
            className={inputStyle}
          />
        </div>
        {/* 

        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">
            Nhân viên được phân công
          </label>
          <select
            name="assigned_to"
            onChange={handleChange}
            className={inputStyle}
            value={form.assigned_to}
          >
            <option value="">-- Chọn nhân viên --</option>
            {technicians.map((t) => (
              <option value={t.user_id}>{t.fullname}</option>
            ))}
          </select>
        </div>
 */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">Tiến độ công việc</label>
          <select
            name="progress_step"
            onChange={handleChange}
            className={inputStyle}
            value={form.progress_step}
          >
            <option value="">-- Chọn tiến độ hoàn thành --</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Đã phân công">Đã phân công</option>
            <option value="Đang chuẩn bị vật tư">Đang chuẩn bị vật tư</option>
            <option value="Đang thực hiện">Đang thực hiện</option>
            <option value="Chờ nghiệm thu">Chờ nghiệm thu</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Hoãn">Hoãn</option>
            <option value="Hủy bỏ">Hủy bỏ</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">Ghi chú</label>
          <textarea
            name="note"
            onChange={handleChange}
            className={`${inputStyle} resize-none h-24`}
            value={form.note}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            {isEdit ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </form>
    </div>
  );
}
