import { TOASTER_STATUS } from '../../constant';
import { ADMIN_LISTENER_API_ROUTES } from '../../constant/apiRoute';
import { IActivePlan } from '../../pages/admin/Listener/AdminListener';
import { showToastMessage } from '../../utils';
import AxiosClient from '../AxiosClient';

export const getListenerDetails = async (
  handleListenerDetail: (episodeDetails: any) => void,
  handleLoading: (value: boolean) => void,
  page: number = 1,
  size: number = 8,
) => {
  try {
    const response = await AxiosClient.get(
      `${ADMIN_LISTENER_API_ROUTES.GET_LISTENERS}?page=${page - 1}&size=${size}`,
    );

    if (response?.data?.success) {
      handleListenerDetail(response?.data?.result);
      handleLoading(false);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.developerMessage || error?.message,
    );
  }
};

export const inviteListener = async (
  email: string,
  closeAddListenerPopup: () => void,
  handleDisabled: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.post(
      `${ADMIN_LISTENER_API_ROUTES.INVITE_LISTENER}/${email}`,
    );

    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);

      closeAddListenerPopup();
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.developerMessage || error?.message,
    );
  } finally {
    handleDisabled(false);
  }
};

export const deleteListener = async (
  uuid: string,
  handleLoading: (value: boolean) => void,
  handleDisabled: (value: boolean) => void,
  onContinue: () => void,
) => {
  try {
    const response = await AxiosClient.delete(
      `${ADMIN_LISTENER_API_ROUTES.DELETE_LISTENER}/${uuid}?role=LISTENER`,
    );

    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
      onContinue();
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.developerMessage || error?.message,
    );
  } finally {
    handleLoading(false);
    handleDisabled(false);
  }
};

export const blockListener = async (
  data: any,
  closeBlockUserPopup: () => void,
  onContinue: () => void,
  handleDisabled: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.put(
      `${ADMIN_LISTENER_API_ROUTES.BLOCK_LISTENER}`,
      data,
    );

    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
      closeBlockUserPopup();
      onContinue();
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.developerMessage || error?.message,
    );
  } finally {
    handleDisabled(false);
  }
};

export const getActiveListenerPlan = async (
  handleActiveListenerPlan: (plan: IActivePlan) => void,
  userUuid: string,
) => {
  try {
    const response = await AxiosClient.get(
      `${ADMIN_LISTENER_API_ROUTES.GET_ACTIVE_PLAN}/${userUuid}?role=LISTENER`,
    );

    if (response?.data?.success) {
      handleActiveListenerPlan(response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.developerMessage || error?.message,
    );
  }
};

export const getListenerPlans = async (
  handleListenerPlan: (plan: any, period: string) => void,
  period: string,
) => {
  try {
    const response = await AxiosClient.get(
      `${ADMIN_LISTENER_API_ROUTES.GET_PLANS}?role=LISTENER&period=${period}`,
    );

    if (response?.data?.success) {
      handleListenerPlan(response?.data?.result, period);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.developerMessage || error?.message,
    );
  }
};

export const upgradeListenerPlan = async (
  planUuid: string,
  userUuid: string,
  closeEditPlanPopup: () => void,
  onContinue: () => void,
  handleDisabled: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.put(
      `${ADMIN_LISTENER_API_ROUTES.UPGRADE_PLAN}/${planUuid}/user/${userUuid}`,
    );

    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
      closeEditPlanPopup();
      onContinue();
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.developerMessage || error?.message,
    );
  } finally {
    handleDisabled(false);
  }
};
