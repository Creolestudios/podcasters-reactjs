import axios from 'axios';

import { ADMIN_API_ROUTES } from '../../constant/apiRoute';
import { ILogin } from '../../types/auth';
import { API_URL } from '../../clientConfig';

export const loginService = async (loginData: ILogin) => {
  const response = await axios.post(`${API_URL}${ADMIN_API_ROUTES.LOGIN}`, loginData);

  return response;
};
