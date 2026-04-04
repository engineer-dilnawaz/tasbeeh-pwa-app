import axios from "axios";

/** Swap base URL / headers when you have a real Islamic API key */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_ISLAMIC_API_BASE_URL ?? "https://api.example.com/v1",
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    ...(import.meta.env.VITE_ISLAMIC_API_KEY && {
      "X-API-Key": import.meta.env.VITE_ISLAMIC_API_KEY,
    }),
  },
});
