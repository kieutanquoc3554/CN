import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, PencilIcon, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import UpdateMaterialForm from "../components/UpdateMaterialForm";
import formatCurrency from "../utils/formatCurrency";

export default function Materials() {
  const [spareParts, setSpareParts] = useState([]);
  const [machineDetails, setMachineDetails] = useState([]);
  const [devices, setDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParts = spareParts.slice(indexOfFirstItem, indexOfLastItem);

  const [newPart, setNewPart] = useState({
    name: "",
    code: "",
    unit: "",
    current_stock: "",
    min_stock_level: "",
    device_id: "",
    detail_id: "",
  });

  const [newDetailName, setNewDetailName] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("materials");
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    try {
      const [parts, details, devicesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVER_URL}/spare-parts`),
        axios.get(`${import.meta.env.VITE_SERVER_URL}/machine-details`),
        axios.get(`${import.meta.env.VITE_SERVER_URL}/devices`),
      ]);
      setSpareParts(parts.data);
      setMachineDetails(details.data);
      setDevices(devicesRes.data);
    } catch (error) {
      console.error("Lỗi fetch dữ liệu:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/inventory/transactions`
      );
      setTransactions(res.data);
    } catch (err) {
      console.error("Lỗi khi fetch lịch sử giao dịch:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setNewPart({ ...newPart, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let detail_id = newPart.detail_id;

      if (newDetailName.trim() !== "") {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/machine-details`,
          {
            name: newDetailName,
          }
        );
        detail_id = res.data.id;
      }

      await axios.post(`${import.meta.env.VITE_SERVER_URL}/spare-parts`, {
        ...newPart,
        detail_id,
      });

      await fetchData();

      setNewPart({
        name: "",
        code: "",
        unit: "",
        current_stock: "",
        min_stock_level: "",
        device_id: "",
        detail_id: "",
      });
      setNewDetailName("");
      toast.success("Tạo vật tư thành công!");
    } catch (error) {
      console.error("Lỗi tạo vật tư:", error);
    }
  };

  const handleUpdate = (material) => {
    setSelectedMaterial(material);
    setShowUpdateModal(true);
  };

  return (
    <>
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setActiveTab("materials")}
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "materials"
              ? "bg-white border border-b-0 font-semibold"
              : "bg-gray-100 text-gray-600 cursor-pointer"
          }`}
        >
          📦 Vật tư
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "transactions"
              ? "bg-white border border-b-0 font-semibold"
              : "bg-gray-100 text-gray-600 cursor-pointer"
          }`}
        >
          🧾 Lịch sử kho
        </button>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quản lý vật tư</h2>
        </div>
        {activeTab === "materials" && (
          <>
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl shadow mb-8 space-y-4"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  name="name"
                  placeholder="Tên vật tư"
                  value={newPart.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <input
                  name="code"
                  placeholder="Mã vật tư"
                  value={newPart.code}
                  onChange={handleChange}
                  className="input"
                />
                <input
                  name="unit"
                  placeholder="Đơn vị tính"
                  value={newPart.unit}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  name="current_stock"
                  type="number"
                  placeholder="Tồn kho hiện tại"
                  value={newPart.current_stock}
                  onChange={handleChange}
                  className="input"
                />
                <input
                  name="min_stock_level"
                  type="number"
                  placeholder="Tồn kho tối thiểu"
                  value={newPart.min_stock_level}
                  onChange={handleChange}
                  className="input"
                />
                <select
                  name="device_id"
                  value={newPart.device_id}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">-- Chọn thiết bị --</option>
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  name="detail_id"
                  value={newPart.detail_id}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">-- Chọn nhóm chi tiết máy --</option>
                  {machineDetails.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Hoặc nhập nhóm chi tiết mới"
                  value={newDetailName}
                  onChange={(e) => setNewDetailName(e.target.value)}
                  className="input"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition shadow-sm"
              >
                Lưu vật tư
              </button>
            </form>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📋 Danh sách vật tư
              </h2>
              <div className="overflow-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Thiết bị</th>
                      <th className="px-4 py-3">Chi tiết máy</th>
                      <th className="px-4 py-3">Tên vật tư</th>
                      <th className="px-4 py-3">Mã</th>
                      <th className="px-4 py-3">Đơn vị</th>
                      <th className="px-4 py-3">Tồn kho</th>
                      <th className="px-4 py-3">Tối thiểu</th>
                      <th className="px-4 py-3">Cập nhật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentParts.map((part, i) => (
                      <tr
                        key={part.id}
                        className="hover:bg-blue-50 transition border-b border-gray-200"
                      >
                        <td className="px-4 py-2">
                          {indexOfFirstItem + i + 1}
                        </td>
                        <td className="px-4 py-2">{part.device_name}</td>
                        <td className="px-4 py-2">{part.detail_name}</td>
                        <td className="px-4 py-2">{part.name}</td>
                        <td className="px-4 py-2">{part.code}</td>
                        <td className="px-4 py-2">{part.unit}</td>
                        <td className="px-4 py-2">{part.current_stock}</td>
                        <td className="px-4 py-2">{part.min_stock_level}</td>
                        <td className="px-4 py-2">
                          <PencilIcon
                            className="w-5 h-5 inline"
                            onClick={() => handleUpdate(part)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-center mt-4 gap-2">
                  {Array.from(
                    { length: Math.ceil(spareParts.length / itemsPerPage) },
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 border rounded ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-600"
                        }`}
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === "transactions" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              🧾 Lịch sử nhập / xuất kho
            </h2>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Vật tư</th>
                    <th className="px-4 py-3">Loại</th>
                    <th className="px-4 py-3">Số lượng</th>
                    <th className="px-4 py-3">Giá nhập</th>
                    <th className="px-4 py-3">Ngày</th>
                    <th className="px-4 py-3">Ghi chú</th>
                    <th className="px-4 py-3">Người tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-blue-50 transition border-b"
                    >
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{tx.spare_part_name}</td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          tx.type === "IN" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.type === "IN" ? "Nhập" : "Xuất"}
                      </td>
                      <td className="px-4 py-2">{tx.quantity}</td>
                      <td className="px-4 py-2">{formatCurrency(tx.price)}</td>
                      <td className="px-4 py-2">
                        {new Date(tx.date).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-4 py-2">{tx.note || "-"}</td>
                      <td className="px-4 py-2">
                        {tx.created_by_name || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {showUpdateModal && selectedMaterial && (
        <UpdateMaterialForm
          material={selectedMaterial}
          onClose={() => setShowUpdateModal(false)}
          onUpdated={fetchData}
        />
      )}
    </>
  );
}
