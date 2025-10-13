import axios from "axios";
import { apiPost } from "../api/ServiceManager";
import { AUTH_USER, CREATE_EMP, HISTORY } from "./constant";

let optionAxios = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
};

const auth_user = async (user) => {
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
        localStorage.setItem("user", JSON.stringify(resp.data));
        return true;
      }
      return false;
    },
    (err) => {
      console.log("auth_user API error  :::::::::::: ", err.message);
    }
  );
};

const getHistoryData = async (input) => {
  input = { ...input };

  return await axios
    .post(HISTORY, input, optionAxios)
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const add_emp = async (input) => {
  input = { ...input };
  return await axios
    .post(CREATE_EMP, input, optionAxios)
    .then(function (resp) {
      return resp;
    })
    .catch((error) => {
      console.log(error);
    });
};

const isLogin = () => {
  let user = localStorage.getItem("AUTH_DATA");
  //console.log(user)
  if (user && ifLoginValid()) {
    resetLoginExpired();
    return true;
  } else {
    return false;
  }
};

const toSnakeCase = (str) => {
  return str
    .replace(/([A-Z])/g, "_$1") // Add underscore before capital letters
    .toLowerCase() // Convert the whole string to lowercase
    .replace(/^_/, ""); // Remove leading underscore if present
};

const getUserPermission = () => {
  let user = localStorage.getItem("AUTH_DATA");
  user = (user && JSON.parse(user)) || null;
  const access =
    (user && user.permissions && JSON.parse(user.permissions)) || {};
  return access;
};

export {
  auth_user,
  isLogin,
  toSnakeCase,
  getUserPermission,
  getHistoryData,
  add_emp,
};
