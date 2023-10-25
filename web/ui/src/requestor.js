import axios from "axios";

const instance = axios.create();

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // If the status code is 200, return the data
    if (response.status === 200) {
      return response.data;
    }

    return Promise.reject(new Error(response.data));
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
