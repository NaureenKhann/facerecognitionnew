import { Navigate, Outlet } from "react-router-dom";

const Protectedroute = () => {
  const isAuthenticated = true; // or from auth service

  return isAuthenticated ? <Outlet /> : <Navigate to="/Login" />;
};

export default Protectedroute;
