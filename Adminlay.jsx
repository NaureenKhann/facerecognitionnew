import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import "../../styles/admin.css";

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <Sidebar />

      <div className="admin-main">
        <Header />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
