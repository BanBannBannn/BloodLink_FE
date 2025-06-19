import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7202",
  timeout: 10000,
});

export default instance;
