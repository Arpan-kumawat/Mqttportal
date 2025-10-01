import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../screens/Dashboard.jsx";
import LoginPage from "../components/LoginPage";
import PrivateRoute from "./PrivateRoute.jsx";
import { useAuth } from "../contexts/AuthContext";
import Setting from "../screens/Setting";
import MainLayout from "../layout/MainLayout.jsx";

const AppRoutes = () => {
  const { user } = useAuth();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = user || localUser;

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />

        {/* Protected routes wrapped in MainLayout */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/setting" element={<Setting />} />
            {/* add more protected routes here */}
          </Route>
        </Route>

        {/* Catch-all route (optional) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
