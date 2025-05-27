// import { dispatch } from '../store/store';
import { authRefresh, disconnect } from '@/features/auth/auth.slice';
import { resetUser } from '@/features/auth/user.slice';
import { resetCart } from '@/features/basket/basket.slice';
import { resetSearch } from '@/features/search/search.slice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

let store;
export const injectStore = (_store) => {
    store = _store;
};



let url = "https://vidiboutique-api.onrender.com/";
if (window.location.href.includes("localhost"))
    // url = "http://localhost:5002/"
    url = "http://127.0.0.1:5000/"
const axiosInstance = axios.create({ baseURL: url });


const disconnectUser = () => {
    const { dispatch } = store;

    storeNewTokens({ access_token: null, refresh_token: null });
    dispatch(resetCart())
    dispatch(resetUser())
    dispatch(resetSearch())
    dispatch(disconnect())
}

const refreshAccessToken = async () => {
    const auth = localStorage.getItem("persist:root");
    const { refreshToken } = JSON.parse(JSON.parse(auth).auth);

    try {
        const response = await axios.post(`${url}auth/refresh`, null, {
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        });

        if (response.status !== 200) {
            disconnectUser()
        }
        return response
    } catch (error) {
        disconnectUser()
    }
};

const storeNewTokens = (access_token, refresh_token) => {
    const { dispatch } = store;
    dispatch(authRefresh({ access_token, refresh_token }));
}

const refreshAndRetryQueue = [];
let isRefreshing = false;
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().auth.accessToken;
        if (accessToken) {
            config.headers["Authorization"] = "Bearer " + accessToken;
        }
        return config;
    }
);
axiosInstance.interceptors.response.use(
    (config) => {
        const accessToken = store.getState().auth.accessToken;
        if (accessToken) {
            config.headers["Authorization"] = "Bearer " + accessToken;
        }
        return config;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const { access_token, refresh_token } = await refreshAccessToken();

                    error.config.headers['Authorization'] = `Bearer ${access_token}`;
                    storeNewTokens(access_token, refresh_token)

                    refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                        config.headers['Authorization'] = `Bearer ${access_token}`;
                        axiosInstance
                            .request(config)
                            .then((response) => resolve(response))
                            .catch((err) => reject(err));
                    });

                    refreshAndRetryQueue.length = 0;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    throw refreshError;
                } finally {
                    isRefreshing = false;
                }
            }
            return new Promise((resolve, reject) => {
                refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
            });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;