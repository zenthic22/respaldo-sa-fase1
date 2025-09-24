import axios from "axios";

const userApi = axios.create({
    baseURL: "http://localhost:3001/api"
})

userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

export default userApi;