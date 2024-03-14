import axios, { AxiosInstance, AxiosRequestConfig, CancelTokenStatic } from 'axios';
import { API_URL } from '../clientConfig';
import {
  clearLocalStorage, getHost, getLocalStorage, showToastMessage,
} from '../utils';
import { ADMIN_APP_ROUTES, OPEN_APP_ROUTES, PODCASTER_APP_ROUTES } from '../constant/appRoute';
import { APP_HOST, TOASTER_STATUS } from '../constant';

interface CustomAxiosInstance extends AxiosInstance {
  cancelToken?: CancelTokenStatic;
  isCancel?(value: any): boolean;
}

const AxiosClient: CustomAxiosInstance = axios.create({
  baseURL: API_URL!!,
});

AxiosClient.cancelToken = axios.CancelToken;
AxiosClient.isCancel = axios.isCancel;

AxiosClient.interceptors.request.use((config: AxiosRequestConfig): any => {
  const tokenExpiryTime = getLocalStorage('tokenExpiryTime');
  const host = getHost();
  if (Date.now() >= tokenExpiryTime && getHost()) {
    clearLocalStorage();
    showToastMessage(TOASTER_STATUS.ERROR, 'Token is expired or not present, logging out...');
    if (host === APP_HOST.PODCASTER) {
      window.location.replace(`/${PODCASTER_APP_ROUTES.LOGIN}`);
    } else if (host === APP_HOST.ADMIN) {
      window.location.replace(`/${ADMIN_APP_ROUTES.LOGIN}`);
    } else {
      window.location.replace(`/${OPEN_APP_ROUTES.LOGIN}`);
    }
  }

  const accessToken = localStorage.getItem('accessToken');

  const _config = {
    ...config,
    headers: {
      ...config.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };

  return _config;
});

AxiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config, code } = error;
    if (!response && config.url.includes('rest/users/') && code === 'ERR_NETWORK') {
      clearLocalStorage();
      window.location.replace('/login');
    }
    if (response && response.status === 401) {
      clearLocalStorage();
      window.location.replace('/login');
    }
    return Promise.reject(error);
  },
);

export default AxiosClient;
