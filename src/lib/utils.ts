import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import instance from "./axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
instance.interceptors.request.use((config) => {
  console.log(">> Outgoing request:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
  });
  return config;
});