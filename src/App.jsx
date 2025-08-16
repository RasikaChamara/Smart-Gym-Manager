import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./components/AdminLayout";
import Register from "./pages/Register";
import ApproveMembers from "./pages/ApproveMembers";
import ViewMembers from "./pages/ViewMembers";
import AddMemberNoEmail from "./pages/AddMemberNoEmail";
import Attendance from "./pages/Attendance";
import AddPayment from "./pages/AddPayment";
import ViewPayments from "./pages/ViewPayments";
import AddMeasurement from "./pages/AddMeasurement";
import ViewMeasurements from "./pages/ViewMeasurements";
import CreateSchedule from "./pages/CreateSchedule";
import ViewSchedules from "./pages/ViewSchedules";
import Notifications from "./pages/notifications";
import ManageExercises from "./pages/ManageExercises";
import About from "./pages/About";
import MemberLayout from "./components/MemberLayout";
import MemberDashboard from "./pages/member/Dashboard";

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="approve-members" element={<ApproveMembers />} />
            <Route path="view-members" element={<ViewMembers />} />
            <Route
              path="/admin/add-member-no-email"
              element={<AddMemberNoEmail />}
            />
            <Route path="attendance" element={<Attendance />} />
            <Route path="payments" element={<AddPayment />} />
            <Route path="payments/view" element={<ViewPayments />} />
            <Route path="measurements/add" element={<AddMeasurement />} />
            <Route path="measurements/view" element={<ViewMeasurements />} />
            <Route path="schedule/add" element={<CreateSchedule />} />
            <Route path="schedule/view" element={<ViewSchedules />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="manage_ex" element={<ManageExercises />} />
            <Route path="about" element={<About />} />
          </Route>
        </Route>

        {/* Member routes */}
        <Route element={<ProtectedRoute allowedRole="member" />}>
          <Route path="/member" element={<MemberLayout />}>
            {/* Default dashboard content as index route */}
            <Route index element={<MemberDashboard />} />

            {/* Keep dashboard route also if needed */}
            <Route path="dashboard" element={<MemberDashboard />} />

            {/* Later: add routes for member-specific pages like attendance, schedules, measurements */}
          </Route>
        </Route>

        <Route path="/unauthorized" element={<p>Unauthorized Access</p>} />
      </Routes>
    </Router>
  );
}

export default App;
