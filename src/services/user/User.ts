import axios from 'axios';
import AxiosClient from '../AxiosClient';

import { APP_HOST, SUCCESS_MESSAGE, TOASTER_STATUS } from '../../constant';
import { SOCIAL_LOGIN, USER_API_ROUTES } from '../../constant/apiRoute';
import { showToastMessage } from '../../utils';
import { API_URL } from '../../clientConfig';
import {
  IChangePasswordAction,
  IForgotPassword,
  IResetPasswordAction,
} from '../../types/auth';
import { IBankDetails } from '../../types/podcaster';

// Forgot Password
export const forgotPasswordService = async (
  values: IForgotPassword,
  handleStartCountdown: () => void,
  handleDisabled: (value: boolean) => void,
) => {
  try {
    const response = await axios.post(
      `${API_URL}${USER_API_ROUTES.FORGOT_PASSWORD}`,
      values,
    );

    if (response.data.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, SUCCESS_MESSAGE.FORGOT_PASSWORD);
      handleStartCountdown();
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage || error?.message,
    );
  } finally {
    handleDisabled(false);
  }
};

// Reset Password
export const resetPasswordService = async (
  values: IResetPasswordAction,
  onSave: () => void,
  handleLoading: (value: boolean) => void,
) => {
  try {
    const response = await axios.post(
      `${API_URL}${USER_API_ROUTES.RESET_PASSWORD}/${values.token}`,
      { password: values.password },
    );

    if (response.data.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, SUCCESS_MESSAGE.RESET_PASSWORD);
      onSave();
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage || error?.message,
    );
  } finally {
    handleLoading(false);
  }
};

// Change Password
export const changePasswordService = async (
  values: IChangePasswordAction,
  onSave: () => void,
  handleLoading: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.post(
      `${API_URL}${USER_API_ROUTES.CHANGE_PASSWORD}`,
      values,
    );
    handleLoading(false);
    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, SUCCESS_MESSAGE.RESET_PASSWORD);
      onSave();
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
    handleLoading(false);
  }
};

export const getUserDetails = async (host: string) => {
  switch (host) {
    case APP_HOST.PODCASTER:
      return AxiosClient(USER_API_ROUTES.PODCASTER_DETAIL);

    case APP_HOST.ADMIN:
      return AxiosClient(USER_API_ROUTES.ADMIN_DETAIL);

    case APP_HOST.ADVERTISER:
      return AxiosClient(USER_API_ROUTES.ADVERTISER_DETAIL);

    default:
      return AxiosClient(USER_API_ROUTES.LISTENER_DETAIL);
  }
};

export const updateUserDetails = async (data: {}) => AxiosClient.put('api/v1/user/update-user-details', data);

export const podcastMonetize = async (isMonetized: boolean) => AxiosClient.put(`api/v1/user/podcast-monetized/${isMonetized}`);

export const updateProfileAction = async (file: File | null | undefined) => {
  const formData: any = new FormData();
  if (file) {
    formData.append('file', file);
  }
  const response = AxiosClient.put(
    'api/v1/user/update-profile-photo',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response;
};

export const podCasterGoolgeLogin = async (accessToken: string) => {
  try {
    const response = await axios.post(
      `${API_URL}api/v1/social/podcaster/login/google`,
      {
        accessToken,
      },
    );
    return response;
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
    throw error;
  }
};

export const podCasterFacebookLogin = async (accessToken: string) => {
  try {
    const response = await axios.post(
      `${API_URL}api/v1/social/podcaster/login/facebook`,
      {
        accessToken,
      },
    );
    return response;
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
    throw error;
  }
};

export const podCasterLinkedinLogin = async (accessToken: string) => {
  try {
    const response = await axios.post(
      `${API_URL}api/v1/social/podcaster/login/linkedin`,
      {
        accessToken,
      },
    );
    return response;
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
    throw error;
  }
};

export const googleLogin = async (response: any) => {
  try {
    await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${response.access_token}`,
      },
    });
  } catch (err: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      err?.message || 'Something went wrong!',
    );
  }
};

export const linkedinLogin = async (authCode: string) => {
  if (authCode) {
    try {
      const response = await axios.post(
        `${API_URL}${SOCIAL_LOGIN.GET_PODCASTER_TOKEN}/${authCode}`,
      );
      return response.data;
    } catch (err: any) {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        err?.message || 'Something went wrong!',
      );
    }
  }

  return null;
};

export const addBankDetails = async (
  values: IBankDetails,
  onSave: () => void,
  handleLoading: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.post(
      `${USER_API_ROUTES.BANK_DETAILS}`,
      values,
    );

    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
      onSave();
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage || error?.message,
    );
  } finally {
    handleLoading(false);
  }
};

export const getBankDetails = async (
  handleBankDetails: (value: IBankDetails) => void,
  handleLoading: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient(`${USER_API_ROUTES.BANK_DETAILS}`);
    if (response?.data?.success) {
      handleBankDetails(response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage || error?.message,
    );
  } finally {
    handleLoading(false);
  }
};

export const updateBankDetails = async (
  values: IBankDetails,
  onSave: () => void,
  handleLoading: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.put(
      `${USER_API_ROUTES.BANK_DETAILS}`,
      values,
    );

    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
      onSave();
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage || error?.message,
    );
  } finally {
    handleLoading(false);
  }
};

// Set password for invited user
export const setPasswordForInvitedUser = async (
  values: IResetPasswordAction,
  onSave: () => void,
  handleLoading: (value: boolean) => void,
) => {
  try {
    const response = await axios.post(
      `${API_URL}${USER_API_ROUTES.INIVTED_USER_PASSWORD}/${values?.token}`,
      { password: values?.password },
    );

    if (response.data.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
      handleLoading(false);
      onSave();
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage || error?.message,
    );
  }
};
