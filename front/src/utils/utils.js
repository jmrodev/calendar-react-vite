import Cookies from "js-cookie";
import { errorMessages } from "../messages/ErrorMessage";

export const baseUrl = "http://localhost:3001/api";

export const _getHeaders = () => {
  const token = localStorage.getItem("jwt") || Cookies.get("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const _handleError = (method, error) => {
  console.error(`Error in ${method}:`, error);
  return errorMessages[method];
};
