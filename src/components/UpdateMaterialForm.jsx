// UpdateMaterialForm.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdateMaterialForm({ material, onClose, onUpdated }) {
  const [stock, setStock] = useState(material.current_stock);
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const change = stock - material.current_stock;
  const changeType = change > 0 ? "import" : change < 0 ? "export" : "none";

  const handleUpdate = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const change = parseInt(stock) - material.current_stock;
      if (isNaN(change) || change === 0) {
        toast.info("Không có thay đổi tồn kho");
        return;
      }
      const isImport = change > 0;
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/inventory/${
          material.id
        }/update-stock`,
        {
          current_stock: stock,
          note,
          price: isImport ? price : null,
          created_by: user.id,
        }
      );

      toast.success("Cập nhật tồn kho thành công");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(
        `Lỗi khi cập nhật tồn kho ${JSON.parse(
          localStorage.getItem("user")?.id
        )}`,
        err.message
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Cập nhật vật tư: {material.name}
        </h2>
        <h3>Số lượng tồn kho:</h3>
        <input
          type="number"
          className="input w-full mb-4"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          placeholder="Số lượng tồn kho mới"
        />
        {stock > material.current_stock && (
          <>
            <h3>Giá nhập:</h3>
            <input
              type="number"
              className="input w-full mb-4"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Giá nhập mới"
            />
          </>
        )}

        <h3>Ghi chú:</h3>
        <textarea
          className="input w-full mb-4"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú giao dịch (tuỳ chọn)"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="hover:bg-gray-100 text-black px-6 py-2 rounded-xl font-semibold transition shadow-sm cursor-pointer"
          >
            Huỷ
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition shadow-sm cursor-pointer"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}
