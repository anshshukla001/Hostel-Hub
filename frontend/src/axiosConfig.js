import axios from 'axios';

axios.defaults.baseURL = 'https://hostel-hub-backend.vercel.app/';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
