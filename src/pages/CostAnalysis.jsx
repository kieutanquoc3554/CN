import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import formatCurrency from "../utils/formatCurrency";
import * as XLSX from "xlsx";

export default function CostAnalysis() {
  const [report, setReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/inventory/transactions/report`
      );
      setReport(res.data);
      setFilteredReport(res.data);
    };
    fetchReport();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = report.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.machine_group.toLowerCase().includes(lower) ||
        item.machine_detail.toLowerCase().includes(lower)
    );
    setFilteredReport(filtered);
  }, [searchTerm, report]);

  const sortBy = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    const sorted = [...filteredReport].sort((a, b) => {
      const valA = a[key] || "";
      const valB = b[key] || "";
      if (typeof valA === "string")
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      return direction === "asc" ? valA - valB : valB - valA;
    });
    setSortConfig({ key, direction });
    setFilteredReport(sorted);
  };

  const exportExcel = () => {
    const header = [
      "Nhóm máy",
      "Chi tiết máy",
      "Tên vật tư",
      "Mã vật tư",
      "Đơn vị",
      "Tồn kho hiện tại",
      "Tồn tối thiểu",
      "Ngày nhập gần nhất",
      "Ngày xuất gần nhất",
      "Giá nhập",
      "Tổng",
    ];
    const data = filteredReport.map((item) => [
      item.machine_group,
      item.machine_detail,
      item.name,
      item.code,
      item.unit,
      item.current_stock,
      item.minimum_stock,
      item.last_import_date
        ? format(new Date(item.last_import_date), "dd-MM-yyyy")
        : "",
      item.last_export_date
        ? format(new Date(item.last_export_date), "dd-MM-yyyy")
        : "",
      formatCurrency(item.price),
      formatCurrency(item.total),
    ]);

    // Thêm dòng tổng cộng
    data.push(["", "", "", "", "", "", "", "", "", "Tổng cộng", totalSum]);

    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Báo cáo tồn kho");

    // Apply styles
    const totalRowIndex = data.length + 1;
    ws[`K${totalRowIndex}`].s = {
      fill: { fgColor: { rgb: "FFFF00" } }, // Yellow background
      font: { bold: true },
    };

    XLSX.writeFile(wb, "bao_cao_ton_kho.xlsx");
  };

  const totalSum = filteredReport.reduce((sum, r) => sum + r.total, 0);

  const groupColors = {
    "Máy phối trộn và bảo hòa CO₂": "bg-blue-50",
    "Máy chiết rót tự động": "bg-green-50",
    "Máy thổi nhựa": "bg-rose-50",
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Báo cáo giá trị tồn kho vật tư
        </h2>
        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Xuất Excel
        </button>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm tên vật tư, nhóm máy..."
        className="mb-4 px-3 py-2 border border-gray-300 rounded w-full md:w-96 shadow-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-100">
        <table className="min-w-full text-sm text-gray-800 bg-white">
          <thead className="bg-[#615FFF] from-sky-500 to-sky-400 text-white shadow-sm">
            <tr>
              {[
                { key: "machine_group", label: "Nhóm máy" },
                { key: "machine_detail", label: "Chi tiết máy" },
                { key: "name", label: "Tên vật tư" },
                { key: "code", label: "Mã vật tư" },
                { key: "unit", label: "Đơn vị tính" },
                { key: "current_stock", label: "Tồn kho hiện tại" },
                { key: "minimum_stock", label: "Tồn tối thiểu" },
                { key: "last_import_date", label: "Nhập gần nhất" },
                { key: "last_export_date", label: "Xuất gần nhất" },
                { key: "price", label: "Giá nhập" },
                { key: "total", label: "Tổng" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left font-semibold uppercase tracking-wider cursor-pointer hover:underline"
                  onClick={() => sortBy(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredReport.map((item, i) => {
              const warn = item.current_stock < item.minimum_stock;
              return (
                <tr
                  key={i}
                  className={`transition ${
                    warn
                      ? "bg-red-50 text-red-700 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">{item.machine_group}</td>
                  <td className="px-4 py-3">{item.machine_detail}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.code}</td>
                  <td className="px-4 py-3">{item.unit}</td>
                  <td className="px-4 py-3">{item.current_stock}</td>
                  <td className="px-4 py-3">{item.minimum_stock}</td>
                  <td className="px-4 py-3">
                    {item.last_import_date
                      ? format(new Date(item.last_import_date), "dd-MM-yyyy")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {item.last_export_date
                      ? format(new Date(item.last_export_date), "dd-MM-yyyy")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              );
            })}

            <tr className="bg-yellow-500 text-white font-bold text-right text-sm">
              <td colSpan={10} className="px-4 py-4 text-right rounded-bl-xl">
                Tổng cộng:
              </td>
              <td className="px-4 py-4 text-center rounded-br-xl">
                {formatCurrency(totalSum)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
