import React, { createContext, useContext, useState, useEffect } from "react";
import { AUTH_USER } from "../utils/constant";
import { apiPost } from "../api/ServiceManager";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // const login = async (email, password) => {
  //   setIsLoading(true);

  //   // Simulate API call
  //   await new Promise(resolve => setTimeout(resolve, 1000));

  //   // Simple validation for demo
  //   if (email === 'admin' && password === '1234') {
  //     const user = {
  //       id: '1',
  //       name: 'Admin',
  //       user: email
  //     };
  //     setUser(user);
  //     localStorage.setItem('user', JSON.stringify(user));
  //     setIsLoading(false);
  //     return true;
  //   }

  //   setIsLoading(false);
  //   return false;
  // };

  const login = async (user) => {
    setIsLoading(true);

    const { email, password } = user;

    let param = {
      emp_no: email,
      password: password,
      source: "portal_login",
    };

    return await apiPost(
      AUTH_USER,
      param,
      (resp) => {
        if (resp.status) {
          setUser(resp.data);
          localStorage.setItem("user", JSON.stringify(resp.data));
          setIsLoading(false);
          return true;
        }
        setIsLoading(false);
        return false;
      },
      (err) => {
        console.log("auth_user API error  :::::::::::: ", err.message);
      }
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("GateWay");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
