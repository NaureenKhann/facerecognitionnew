import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./admin/Dashboard.jsx";
import Teacher from "./admin/teachers/Teacher.jsx";
import Student from "./admin/students/Student.jsx";
import Timetable from "./admin/timetable/Timetable.jsx";
import ProtectedRoute from "./admin/components/Protectedroute.jsx";
import Subject from "./admin/subject/Subject.jsx";
import Notification from "./admin/notification/Notification.jsx";
import Systemsettings from "./admin/settings/Systemsettings.jsx";
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/teachers" element={<Teacher />} />
        <Route path="/admin/students" element={<Student />} />
        <Route path="/admin/timetable" element={<Timetable />} />
        <Route path="/admin/subject" element={<Subject />} />
        <Route path="/admin/notification" element={<Notification />} />
        <Route path="/admin/settings" element={<Systemsettings />} />
      </Route>

      {/* Optional: Add a 404 route */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;