import axios from "axios";

//Create the baseURL so that we do not have to write the server name again and again in every call.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//Taking the token from the local stoprage and adding it in the header of every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//If the token is expired, then remove the item token and user from local storage and redirect to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
