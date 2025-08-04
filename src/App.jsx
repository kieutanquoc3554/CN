import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Schedule from "./pages/Schedule";
import WorkOrders from "./pages/WorkOrders";
import Technicians from "./pages/Technicians";
import History from "./pages/History";
import CostAnalysis from "./pages/CostAnalysis";
import AppLayout from "./components/AppLayout";
import Materials from "./pages/Materials";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import UpdateTimeline from "./components/UpdateTimeline";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="devices" element={<Devices />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="work-orders" element={<WorkOrders />} />
        <Route path="technicians" element={<Technicians />} />
        <Route path="materials" element={<Materials />} />
        <Route path="maintenance-history" element={<History />} />
        <Route path="cost-analysis" element={<CostAnalysis />} />
        <Route path="update" element={<UpdateTimeline />} />
      </Route>
    </Routes>
  );
}

export default App;
