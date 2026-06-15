import axios from "axios";
import ApiEndpoints, { baseURL } from "../common/ApiEndpoints";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

// sending accessToken to the headers
Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// extend life time of accessToken with the help of refreshToken
Axios.interceptors.request.use(
    (response) => {
        return response;
    },
    async (error) => {
        let origRequest = error.config;

        if (error.response.status === 401 && !origRequest.retry) {
            origRequest.retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken);

                if (newAccessToken) {
                    origRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return Axios(origRequest);
                }
            }
        }

        return Promise.reject(error);
    }
);

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await Axios({
            ...ApiEndpoints.refresh_token,
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });
        const accessToken = response.data.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        return accessToken;
    } catch (err) {
        console.log("error", err);
    }
};

export default Axios;
