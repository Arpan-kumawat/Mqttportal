// ./PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = () => {
const { user } = useAuth();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = user || localUser;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
