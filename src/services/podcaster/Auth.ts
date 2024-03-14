import axios from 'axios';

import { APP_HOST, TOASTER_STATUS } from '../../constant';
import { PODCASTER_API_ROUTES } from '../../constant/apiRoute';
import { setDataInLocalStorage, showToastMessage } from '../../utils';
import { ILogin, ISignup } from '../../types/auth';
import { API_URL } from '../../clientConfig';
import { PODCASTER_APP_ROUTES } from '../../constant/appRoute';

// Signup
export const signupPodcasterService = async (
  userData: ISignup,
  successMessage: string,
  handleLoading: (value: boolean) => void,
  redirect: (value: string) => void,
) => {
  try {
    const response = await axios.post(`${API_URL}${PODCASTER_API_ROUTES.SIGN_UP}`, { ...userData });

    if (response.data.success) {
      redirect(`/${PODCASTER_APP_ROUTES.LOGIN}`);
      showToastMessage(TOASTER_STATUS.SUCCESS, successMessage);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  } finally {
    handleLoading(false);
  }
};

// Account verification
export const verifyPodcasterService = async (
  token: string,
  successMessage: string,
  redirect: (path: string) => void,
) => {
  try {
    const response = await axios.put(`${API_URL}${PODCASTER_API_ROUTES.VERIFY}${token}`);

    if (response.data.success) {
      redirect(`/${PODCASTER_APP_ROUTES.LOGIN}`);
      showToastMessage(TOASTER_STATUS.SUCCESS, successMessage);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};

// Login
export const loginService = async (loginData: ILogin) => {
  const response = await axios.post(`${API_URL}${PODCASTER_API_ROUTES.LOGIN}`, loginData);

  return response;
};

export const checkEmail = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}${PODCASTER_API_ROUTES.CHECK_EMAIL}${email}`);
    return response;
  } catch (error) {
    return null;
  }
};

export const sendEmail = async (
  email: string,
  handleDisabled: CallableFunction,
  onContinue: CallableFunction,
) => {
  try {
    const response = await axios.post(`${API_URL}${PODCASTER_API_ROUTES.SEND_EMAIL}${email}`);
    if (response?.data?.success) {
      setDataInLocalStorage(response?.data?.result);
      localStorage.setItem('host', APP_HOST.PODCASTER);
      onContinue(response?.data?.result?.userProfileCompleted);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  } finally {
    handleDisabled(false);
  }
};

export const verifyUserPodcasterService = async (
  token: string,
  successMessage: string,
  redirect: (path: string) => void,
) => {
  try {
    const response = await axios.post(`${API_URL}${PODCASTER_API_ROUTES.USER_VERIFY}/${token}`);

    if (response?.data?.success) {
      redirect(`/${PODCASTER_APP_ROUTES.LOGIN}`);
      showToastMessage(TOASTER_STATUS.SUCCESS, successMessage);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error?.message,
    );
  }
};

export const googleLogin = async (accessToken: string) => {
  const responseDetails = await axios.post(`${API_URL}${PODCASTER_API_ROUTES.GOOGLE_LOGIN}`, {
    accessToken,
  });
  return responseDetails;
};

export const linkedinLogin = async (accessToken: string) => {
  const responseDetails = await axios.post(`${API_URL}${PODCASTER_API_ROUTES.LINKEDIN_LOGIN}`, {
    accessToken,
  });
  return responseDetails;
};

export const facebookLogin = async (accessToken: string) => {
  const responseDetails = await axios.post(`${API_URL}${PODCASTER_API_ROUTES.FACEBOOK_LOGIN}`, {
    accessToken,
  });
  return responseDetails;
};

export const resendEmail = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}${PODCASTER_API_ROUTES.RESEND_EMAIL}${email}`);
    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  }
};
