import axios from "axios";

const contentApi = axios.create({
    baseURL: "http://localhost:3002/api"
});

contentApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default contentApi;