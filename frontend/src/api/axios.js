import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

let setGlobalLoading = null;

export const injectLoader = (loaderSetter) => {
  setGlobalLoading = loaderSetter;
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("autocart_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (setGlobalLoading) {
    setGlobalLoading(true);
  }

  return config;
});

API.interceptors.response.use(
  (response) => {
    setTimeout(() => {
      if (setGlobalLoading) {
        setGlobalLoading(false);
      }
    }, 800);

    return response;
  },
  (error) => {
    setTimeout(() => {
      if (setGlobalLoading) {
        setGlobalLoading(false);
      }
    }, 800);

    return Promise.reject(error);
  }
);
export default API;