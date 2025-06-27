import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API,
  timeout: 10000,
});

export default instance;
