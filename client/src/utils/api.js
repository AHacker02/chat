import axios from "axios";
import { BASE_URL } from "./endpoints";

const createCustomAxios = () => {
  let instance = axios.create({
    baseURL: BASE_URL,
  });
  instance.interceptors.response.use(
    (response) => successHandler(response),
    (error) => errorHandler(error)
  );

  instance.defaults.headers.common["Content-Type"] = "application/json";
  instance.defaults.headers.post["Content-Type"] = "application/json";

  instance.CancelToken = axios.CancelToken;
  return instance;
};

const customAxios = createCustomAxios();

const successHandler = (response) => {
  if (!response.data.isSuccess) {
    return Promise.reject({
      response: response,
      message: response.data.message,
    });
  }
  return response;
};

const errorHandler = (error) => {
  if (error.response?.headers["application-error"]) {
    error.message = error.response.headers["application-error"];
  } else if (error.response?.data.message) {
    error.message = error.response.data.message;
  }
  return Promise.reject(error);
};

// API middleware to add Bearer token after a successful login
export const saveAuthToken = (store) => (next) => (action) => {
  if (action.type === "user/login/fulfilled") {
    setToken(action.payload.token);
  }
  return next(action);
};

export function setToken(token) {
  customAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default customAxios;
