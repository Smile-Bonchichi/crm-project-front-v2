import axios from 'axios';

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:8080/api'
});

axiosInstance.interceptors.response.use(
    async (response) => {
        return await response.data;
    },
    async (err) => {
        throw err;
    }
);

axiosInstance.interceptors.request.use(
    async (config) => {
        return config;
    }
);

export default axiosInstance;