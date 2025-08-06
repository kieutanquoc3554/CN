import { ClockIcon } from "lucide-react";

const updates = [
  {
    date: "2025-08-06",
    title: "Cập nhật chức năng Phân tích chi phí",
    description: `Thêm API phân tích chi phí, xuất Excel, sửa lỗi, tối ưu hiệu năng`,
  },
  {
    date: "2025-08-04",
    title:
      "Cập nhật chức năng Quản lý vật tư, trang dashboard, bổ sung chức năng Xoá phiếu công việc, sửa lỗi không lưu lịch sử bảo trì, tối ưu hiệu năng và sửa lỗi tồn đọng",
    description: ``,
  },
  {
    date: "2025-08-02",
    title:
      "Sửa lỗi trả không đúng ra id giao việc dẫn tới việc không lưu lại lịch sử phân công của nhân viên, cập nhật lại route gốc dẫn tới dashboard",
    description: `Destructuring sai id, dẫn đến id null`,
  },
  {
    date: "2025-08-01",
    title: "Sửa lỗi tạo phiếu giao việc và Lỗi chính tả",
    description: `
- Đã sửa lỗi "intermediate value is not iterable" do destructuring sai kiểu dữ liệu khi dùng db.query (loại bỏ [result] thay bằng result).
- Cập nhật lại hàm create trong model maintenance_schedule và work_orders để đảm bảo tương thích với kết quả trả về của PostgreSQL.
- Ép kiểu dữ liệu cho các trường như device_id, maintenance_type_id, frequency_value từ string sang number.
- Kiểm tra kỹ result.rows[0] để tránh lỗi không mong muốn khi INSERT thất bại.
- Cập nhật chính tả một số nhãn và thông báo trên giao diện người dùng.
`,
  },

  {
    date: "2025-07-30",
    title: "Hoàn thiện Quản lý danh sách thiết bị",
    description: `•	Thông tin chi tiết thiết bị (mã số, loại, vị trí, tình trạng, ngày lắp đặt). Gắn dữ liệu lịch sử bảo trì và lịch vận hành
. Định danh mức độ ưu tiên của thiết bị (phân nhóm thiết bị quan trọng)
`,
  },
];

export default function UpdateTimeline() {
  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📘 Lịch sử cập nhật hệ thống (v3.0)
      </h2>
      <ol className="relative border-l border-indigo-300">
        {updates.map((item, index) => (
          <li key={index} className="mb-10 ml-6">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-600 rounded-full ring-8 ring-white">
              <ClockIcon className="w-4 h-4 text-white" />
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
              {item.title}
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
              {item.date}
            </time>
            <p className="text-base font-normal text-gray-600">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
