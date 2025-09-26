import axios from "axios";

const favoriteApi = axios.create({
    baseURL: "http://localhost:3002/api"
});

favoriteApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default favoriteApi;