import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const authToken = localStorage.getItem("adminToken");

  return authToken ? <Outlet /> : <Navigate to="/auth/signin" replace />;
};

export default PrivateRoute;
