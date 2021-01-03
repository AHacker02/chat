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
  //To add header again after refresh
  if (
    !instance.defaults.headers.common["Authorization"] &&
    sessionStorage.getItem("auth")
  ) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${
      JSON.parse(sessionStorage.getItem("auth"))?.token
    }`;
  }
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
  if (error.response.headers["application-error"]) {
    return { ...error, message: error.response.headers["application-error"] };
  }
  if (error.response.data.message) {
    return { ...error, message: error.response.data.message };
  }
  return error;
};

export const cancelTokenSource = axios.CancelToken.source();

export function setToken(token) {
  customAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default customAxios;
