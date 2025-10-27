import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "../screens/Dashboard.jsx";
import LoginPage from "../components/LoginPage";
import PrivateRoute from "./PrivateRoute.jsx";
import { useAuth } from "../contexts/AuthContext";
import Setting from "../screens/Setting";
import MainLayout from "../layout/MainLayout.jsx";
import User from "../screens/User.jsx";
import SensorInfo from "../screens/SensorInfo.jsx";
import RealTime from "../screens/RealTime.jsx";
import History from "../screens/History.jsx";
import FFT from "../screens/FFT.jsx";
import Alarm from "../screens/Alarm.jsx";

const AppRoutes = () => {
  const { user } = useAuth();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = user || localUser;
  const [alerts, setAlerts] = React.useState([]);

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
          <Route element={<MainLayout alerts={alerts} setAlerts={setAlerts} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/user" element={<User />} />
            <Route
              path="/real-time"
              element={
                <RealTime
                  onNewAlert={(alert) => setAlerts((prev) => [alert, ...prev])}
                />
              }
            />
            <Route path="/fft" element={<FFT />} />
              <Route path="/alarm" element={<Alarm />} />
            <Route path="/history" element={<History />} />
            <Route path="/sensor-info" element={<SensorInfo />} />
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
