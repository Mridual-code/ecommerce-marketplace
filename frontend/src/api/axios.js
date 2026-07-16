import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

let setGlobalLoading = null;
let activeLoaderRequests = 0;

export const injectLoader = (loaderSetter) => {
  setGlobalLoading = loaderSetter;
};

const startLoader = (config) => {
  if (config.skipLoader) {
    return;
  }

  activeLoaderRequests += 1;

  if (setGlobalLoading) {
    setGlobalLoading(true);
  }
};

const stopLoader = (config = {}) => {
  if (config.skipLoader) {
    return;
  }

  /*
    Small delay prevents the loader from flashing
    too quickly on fast requests.
  */
  setTimeout(() => {
    activeLoaderRequests = Math.max(
      0,
      activeLoaderRequests - 1
    );

    if (
      activeLoaderRequests === 0 &&
      setGlobalLoading
    ) {
      setGlobalLoading(false);
    }
  }, 300);
};

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "autocart_token"
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    startLoader(config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    stopLoader(response.config);

    return response;
  },
  (error) => {
    stopLoader(error.config);

    return Promise.reject(error);
  }
);

export default API;