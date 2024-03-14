import axios from 'axios';
import { TOASTER_STATUS } from '../../constant';
import { showToastMessage } from '../../utils';
import { ILogin, ISignup } from '../../types/auth';
import { API_URL } from '../../clientConfig';
import { ADVERTISER_API_ROUTES } from '../../constant/apiRoute';
import { ADVERTISER_APP_ROUTES } from '../../constant/appRoute';

// Signup
export const signupAdvertiserService = async (
  userData: ISignup,
  successMessage: string,
  handleLoading: CallableFunction,
  redirect: CallableFunction,
) => {
  try {
    const response = await axios.post(
      `${API_URL}${ADVERTISER_API_ROUTES.SIGN_UP}`,
      { ...userData },
    );

    if (response.data.success) {
      redirect(`/${ADVERTISER_APP_ROUTES.LOGIN}`);
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
export const verifyAdvertiserService = async (
  token: string,
  successMessage: string,
  redirect: CallableFunction,
) => {
  try {
    const response = await axios.put(
      `${API_URL}${ADVERTISER_API_ROUTES.VERIFY}${token}`,
    );

    if (response.data.success) {
      redirect(`/${ADVERTISER_APP_ROUTES.LOGIN}`);
      showToastMessage(TOASTER_STATUS.SUCCESS, successMessage);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};

// Login
export const advertiserLoginService = async (loginData: ILogin) => {
  const response = await axios.post(
    `${API_URL}${ADVERTISER_API_ROUTES.LOGIN}`,
    loginData,
  );

  return response;
};

export const resendEmail = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_URL}${ADVERTISER_API_ROUTES.RESEND_EMAIL}${email}`,
    );
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

export const googleLogin = async (accessToken: string) => {
  const responseDetails = await axios.post(
    `${API_URL}${ADVERTISER_API_ROUTES.GOOGLE_LOGIN}`,
    {
      accessToken,
    },
  );
  return responseDetails;
};

export const linkedinLogin = async (accessToken: string) => {
  const responseDetails = await axios.post(
    `${API_URL}${ADVERTISER_API_ROUTES.LINKEDIN_LOGIN}`,
    {
      accessToken,
    },
  );
  return responseDetails;
};

export const facebookLogin = async (accessToken: string) => {
  const responseDetails = await axios.post(
    `${API_URL}${ADVERTISER_API_ROUTES.FACEBOOK_LOGIN}`,
    {
      accessToken,
    },
  );
  return responseDetails;
};
