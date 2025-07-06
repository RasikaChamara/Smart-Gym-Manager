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
            <Route path="/admin/add-member-no-email" element={<AddMemberNoEmail />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="payments" element={<AddPayment />} />
            <Route path="payments/view" element={<ViewPayments />} />
            <Route path="measurements/add" element={<AddMeasurement />} />
            <Route path="measurements/view" element={<ViewMeasurements />} />


            {/* Other admin pages go here */}
          </Route>
        </Route>

        <Route path="/unauthorized" element={<p>Unauthorized Access</p>} />
      </Routes>
    </Router>
  );
}

export default App;
