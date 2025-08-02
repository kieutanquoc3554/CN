import { useState } from "react";
import axios from "axios";
import { X, Plus } from "lucide-react";

export default function AddDeviceForm({
  onSuccess,
  setOpenAddDeviceForm,
  fetch,
}) {
  const [form, setForm] = useState({
    name: "",
    model: "",
    status: "Active",
    priority: "",
    desc: "",
    attributes: [{ name: "", value: "" }],
  });

  const handleAttrChange = (index, key, value) => {
    const updated = [...form.attributes];
    updated[index][key] = value;
    setForm({ ...form, attributes: updated });
  };

  const addAttribute = () => {
    setForm({
      ...form,
      attributes: [...form.attributes, { name: "", value: "" }],
    });
  };

  const removeAttribute = (index) => {
    const updated = [...form.attributes];
    updated.splice(index, 1);
    setForm({ ...form, attributes: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/devices`, form);
      alert("Tạo thiết bị thành công!");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tạo thiết bị");
    } finally {
      setOpenAddDeviceForm(false);
      await fetch();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl space-y-6 overflow-y-auto max-h-[90vh] relative"
      >
        {/* Tiêu đề và nút đóng */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Thêm thiết bị mới
          </h2>
          <button
            type="button"
            onClick={() => setOpenAddDeviceForm(false)}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="cursor-pointer" size={24} />
          </button>
        </div>

        {/* Grid thông tin chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên thiết bị *
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Thiết bị trao đổi nhiệt"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Model</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: XP-4200"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tình trạng</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Active">Đang hoạt động</option>
              <option value="Maintenance">Bảo trì</option>
              <option value="Expired">Hết hạn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Mức độ ưu tiên
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="">-- Chọn --</option>
              <option value="High">Cao</option>
              <option value="Medium">Trung bình</option>
              <option value="Low">Thấp</option>
            </select>
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ghi chú thêm về thiết bị..."
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
          />
        </div>

        {/* Thuộc tính */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Thông số kỹ thuật
          </label>
          <div className="space-y-3">
            {form.attributes.map((attr, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Tên thuộc tính"
                  className="col-span-5 border border-gray-300 rounded-lg px-3 py-2"
                  value={attr.name}
                  onChange={(e) =>
                    handleAttrChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Giá trị"
                  className="col-span-5 border border-gray-300 rounded-lg px-3 py-2"
                  value={attr.value}
                  onChange={(e) =>
                    handleAttrChange(index, "value", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeAttribute(index)}
                  className="col-span-2 text-red-600 hover:text-red-800 font-bold"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAttribute}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
            >
              <Plus size={16} /> Thêm thuộc tính
            </button>
          </div>
        </div>

        {/* Nút submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow font-medium"
          >
            Tạo thiết bị
          </button>
        </div>
      </form>
    </div>
  );
}
