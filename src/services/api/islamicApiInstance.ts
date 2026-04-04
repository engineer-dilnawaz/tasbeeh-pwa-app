import axios from "axios";
import { ISLAMIC_API_V1_BASE, getIslamicApiKey } from "@/features/tasbeeh/api/islamicApi/config";

/**
 * Premium Axios Instance for IslamicAPI
 * Adheres to SOLID by centralizing configuration (Base URL, Timeout, Auth).
 */
export const islamicApiInstance = axios.create({
  baseURL: ISLAMIC_API_V1_BASE,
  timeout: 30000,
});

// Request Interceptor to attach API Key automatically
islamicApiInstance.interceptors.request.use((config) => {
  const apiKey = getIslamicApiKey();
  
  if (apiKey) {
    config.params = {
      ...config.params,
      api_key: apiKey,
    };
  } else {
    console.warn("IslamicAPI: No VITE_ISLAMIC_API_KEY found in environment.");
  }
  
  return config;
});

// Response Interceptor for unified error handling
islamicApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardized logging for easier debugging
    const message = error.response?.data?.message || error.message;
    console.error(`IslamicAPI [${error.config?.url}] Error:`, message);
    return Promise.reject(error);
  }
);
