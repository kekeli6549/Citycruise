import axios from 'axios';
import { useAuthStore } from '../context/authstore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token to every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user?.token; 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;