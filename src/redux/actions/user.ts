import { loginService as podcasterLoginService } from '../../services/podcaster/Auth';
import { loginService as listenerLoginService } from '../../services/listener/Auth';
import { loginService as adminLoginService } from '../../services/admin/Auth';
import { advertiserLoginService } from '../../services/Advertiser/Auth';

import { setDataInLocalStorage, showToastMessage } from '../../utils';
import {
  GET_USER_DETAIL,
  PODCASTER_LOGIN,
  UPDATE_USER_DETAIL,
  LISTENER_LOGIN,
  ADMIN_LOGIN,
  ADVERTISER_LOGIN,
  USER_LOGOUT,
  SET_AUDIO_EDITOR_EPISODES_COUNT,
} from '../constants/user';
import { APP_HOST, TOASTER_STATUS } from '../../constant';

import { UserDispatch, UserGetState } from '../types/user';
import { ILogin } from '../../types/auth';
import {
  ActivePlanUuidAndEndDate, IMonetizePodcast, IUpdateUser, IUpdateCount,
} from '../../types';
import { getUserDetails } from '../../services/user/User';
import { getEpisodeList } from '../../services/podcaster/AudioEditor';

// Podcaster login Action
export const podCasterLoginAction = (
  loginData: ILogin,
  handleLoading: (value: boolean) => void,
  onContinue: (userProfile: boolean, userPurchasedPlan: boolean) => void,
  handleResendEmail: (email: string) => void,
) => async (dispatch: UserDispatch, getState: UserGetState) => {
  try {
    const response = await podcasterLoginService(loginData);
    if (response.data.success) {
      setDataInLocalStorage(response.data.result);
      localStorage.setItem('host', APP_HOST.PODCASTER);
      dispatch({
        type: PODCASTER_LOGIN,
        payload: {
          ...getState().user,
          uuid: response.data.result.uuid,
          email: response.data.result.email,
          roles: response.data.result.roles,
          userProfileCompleted: response.data.result.userProfileCompleted,
          userPurchasedPlan: response.data.result.userPurchasedPlan,
        },
      });
      onContinue(
        response.data.result.userProfileCompleted,
        response.data.result.userPurchasedPlan,
      );
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    if (error?.response?.data?.result?.errorCode === '4040104') {
      handleResendEmail(loginData.email);
    } else {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        error?.response?.data?.result?.developerMessage ?? error.message,
      );
    }
  } finally {
    handleLoading(false);
  }
};

// PODCASTER: Get episodes count in audio editor
export function getEditorEpisodeCount() {
  return async (dispatch: UserDispatch) => {
    try {
      const response = await getEpisodeList();

      if (response.data.success) {
        dispatch({
          type: SET_AUDIO_EDITOR_EPISODES_COUNT,
          payload: response.data.result.length,
        });
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
      }
    } catch (error: any) {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        error?.response?.data?.result?.errorMessage ?? error.message,
      );
    }
  };
}

// Get user detail
export function getUserDetailAction(host: string, handleLoading: CallableFunction = () => {}) {
  return async (dispatch: UserDispatch, getState: UserGetState) => {
    try {
      const response = await getUserDetails(host);

      if (host === APP_HOST.PODCASTER) {
        dispatch(getEditorEpisodeCount());
      }

      if (response.data.success) {
        dispatch({
          type: GET_USER_DETAIL,
          payload: {
            ...getState().user,
            ...response.data.result,
          },
        });
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
      }
    } catch (error: any) {
      showToastMessage(TOASTER_STATUS.ERROR, error.message);
    } finally {
      handleLoading(false);
    }
  };
}

// Update user detail
type updateAction = IUpdateUser | IMonetizePodcast | IUpdateCount | ActivePlanUuidAndEndDate;
export function updateUserDetailAction(data: updateAction) {
  return async (dispatch: UserDispatch, getState: UserGetState) => {
    dispatch({
      type: UPDATE_USER_DETAIL,
      payload: {
        ...getState().user,
        ...data,
      },
    });
  };
}

// Listener login Action
export const listenerLoginAction = (
  loginData: ILogin,
  handleLoading: (value: boolean) => void,
  onContinue: (userProfile: boolean) => void,
  handleResendEmail: (email: string) => void,
) => async (dispatch: UserDispatch, getState: UserGetState) => {
  try {
    const response = await listenerLoginService(loginData);
    if (response.data.success) {
      setDataInLocalStorage(response.data.result);
      localStorage.setItem('host', APP_HOST.LISTENER);
      dispatch({
        type: LISTENER_LOGIN,
        payload: {
          ...getState().user,
          uuid: response.data.result.uuid,
          email: response.data.result.email,
          roles: response.data.result.roles,
          userProfileCompleted: response.data.result.userProfileCompleted,
        },
      });
      onContinue(response.data.result.userProfileCompleted);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    if (error?.response?.data?.result?.errorCode === '4040104') {
      handleResendEmail(loginData.email);
    } else {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        error?.response?.data?.result?.developerMessage ?? error.message,
      );
    }
  } finally {
    handleLoading(false);
  }
};

// Admin login Action
export function adminLoginAction(
  loginData: ILogin,
  handleLoading: (value: boolean) => void,
  onContinue: () => void,
) {
  return async (dispatch: UserDispatch, getState: UserGetState) => {
    try {
      const response = await adminLoginService(loginData);
      if (response?.data?.success) {
        setDataInLocalStorage(response?.data?.result);
        localStorage.setItem('host', APP_HOST.ADMIN);
        dispatch({
          type: ADMIN_LOGIN,
          payload: {
            ...getState().user,
            uuid: response?.data?.result?.uuid,
            email: response?.data?.result?.email,
            roles: response?.data?.result?.roles,
            userProfileCompleted: response?.data?.result?.userProfileCompleted,
          },
        });
        onContinue();
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
      }
    } catch (error: any) {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        error?.response?.data?.result?.developerMessage ?? error?.message,
      );
    } finally {
      handleLoading(false);
    }
  };
}

// Admin login Action
export const advertiserLoginAction = (
  loginData: ILogin,
  handleLoading: CallableFunction,
  onContinue: CallableFunction,
  handleResendEmail: (email: string) => void,
) => async (dispatch: UserDispatch, getState: UserGetState) => {
  try {
    const response = await advertiserLoginService(loginData);
    if (response?.data?.success) {
      setDataInLocalStorage(response?.data?.result);
      localStorage.setItem('host', APP_HOST.ADVERTISER);
      dispatch({
        type: ADVERTISER_LOGIN,
        payload: {
          ...getState().user,
          uuid: response?.data?.result?.uuid,
          email: response?.data?.result?.email,
          roles: response?.data?.result?.roles,
          userProfileCompleted: response?.data?.result?.userProfileCompleted,
        },
      });
      onContinue();
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    if (error?.response?.data?.result?.errorCode === '4040104') {
      handleResendEmail(loginData.email);
    } else {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        error?.response?.data?.result?.developerMessage ?? error.message,
      );
    }
  } finally {
    handleLoading(false);
  }
};

export function userLogout() {
  return async (dispatch: UserDispatch) => dispatch({
    type: USER_LOGOUT,
  });
}
