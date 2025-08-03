import { ClockIcon } from "lucide-react";

const updates = [
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
        📘 Lịch sử cập nhật hệ thống
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
