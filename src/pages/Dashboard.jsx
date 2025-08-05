import useDashboardData from "../hooks/api/useDashboard";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#f87171"];

export default function Dashboard() {
  const { data, loading } = useDashboardData();

  if (loading) return <p className="text-gray-500 p-4">Đang tải dữ liệu...</p>;

  const {
    deviceStats = [],
    scheduleStats = [],
    upcomingMaintenance = [],
    workOrderStats = [],
    weeklySchedule = [],
    workload = [],
  } = data;

  // Chuẩn hóa dữ liệu thống kê thiết bị
  const statusCounts = {
    active: 0,
    maintenance: 0,
    expired: 0,
  };

  deviceStats.forEach((item) => {
    const status = item.status?.toLowerCase();
    const count = parseInt(item.count);
    if (status === "active") statusCounts.active = count;
    else if (status === "maintenance") statusCounts.maintenance = count;
    else if (status === "expired") statusCounts.expired = count;
  });

  // Chuẩn hóa dữ liệu tiến độ bảo trì
  const formattedScheduleStats = scheduleStats.map((item) => ({
    step: item.progress_step,
    count: parseInt(item.count),
  }));

  // Lấy số liệu phiếu công việc
  const completionData = workOrderStats[0] || { completed: 0, pending: 0 };
  const completed = parseInt(completionData.completed);
  const pending = parseInt(completionData.pending);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Tổng quan hệ thống
      </h2>

      {/* Tổng hợp trạng thái thiết bị */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <Activity className="text-green-500 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Đang hoạt động</p>
              <p className="text-xl font-semibold">{statusCounts.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <Wrench className="text-blue-500 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Bảo trì</p>
              <p className="text-xl font-semibold">
                {statusCounts.maintenance}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <AlertTriangle className="text-red-500 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Hết hạn</p>
              <p className="text-xl font-semibold">{statusCounts.expired}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ tiến độ bảo trì */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Tiến độ bảo trì
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={formattedScheduleStats}>
            <XAxis dataKey="step" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Thiết bị sắp đến hạn */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Thiết bị sắp đến hạn
        </h3>
        <ul className="list-disc ml-6 text-gray-600">
          {upcomingMaintenance.length === 0 ? (
            <li>Không có thiết bị nào sắp đến hạn.</li>
          ) : (
            upcomingMaintenance.map((item, index) => (
              <li key={index}>
                <strong>{item.name}</strong> – Hạn:{" "}
                {new Date(item.next_due_date).toLocaleDateString("vi-VN")}
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Lịch bảo trì tuần này</h3>
        <ul className="list-disc ml-6 text-gray-600">
          {weeklySchedule.map((item, index) => (
            <li key={index}>
              <strong>{item.name}</strong> –{" "}
              {new Date(item.next_due_date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Tỉ lệ hoàn thành kế hoạch */}
      <div className="flex gap-5">
        <div className="bg-white rounded-xl shadow p-4 max-w-xs">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Tỉ lệ hoàn thành kế hoạch
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                dataKey="value"
                data={[
                  { name: "Hoàn thành", value: completed },
                  { name: "Chưa hoàn thành", value: pending },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                label
              >
                <Cell fill="#10b981" />
                <Cell fill="#f87171" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">
            Khối lượng công việc theo kỹ thuật viên
          </h3>
          <ul className="text-gray-700 list-disc ml-6">
            {workload.map((item, index) => (
              <li key={index}>
                {item.technician} – {item.total_work_orders} công việc
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
