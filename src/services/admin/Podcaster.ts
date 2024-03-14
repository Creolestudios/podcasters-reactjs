import { TOASTER_STATUS } from '../../constant';
import { ADMIN_PODCASTER_API_ROUTES } from '../../constant/apiRoute';
import { IActivePlan } from '../../pages/admin/Podcaster/AdminPodcaster';
import { showToastMessage } from '../../utils';
import AxiosClient from '../AxiosClient';

export const getPodcasterDetails = async (
  handlePodcasterDetail: (episodeDetails: any) => void,
  handleLoading: (value: boolean) => void,
  page: number = 0,
  size: number = 8,
) => {
  try {
    const response = await AxiosClient.get(
      `${ADMIN_PODCASTER_API_ROUTES.GET_PODCASTERS}?page=${
        page - 1
      }&size=${size}`,
    );

    if (response?.data?.success) {
      handlePodcasterDetail(response?.data?.result);
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

export const getActivePodcasterDetails = async (
  handlePodcasterDetail: (podcastDetails: any) => void,
  handleLoading: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.get(
      `${ADMIN_PODCASTER_API_ROUTES.GET_ACTIVE_PODCASTERS}`,
    );

    if (response?.data?.success) {
      handlePodcasterDetail(response?.data?.result);
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

export const invitePodcaster = async (
  email: string,
  closeAddPodcasterPopup: () => void,
  handleDisabled: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.post(
      `${ADMIN_PODCASTER_API_ROUTES.INVITE_PODCASTER}/${email}`,
    );

    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);

      closeAddPodcasterPopup();
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

export const deletePodcaster = async (
  uuid: string,
  handleLoading: (value: boolean) => void,
  handleDisabled: (value: boolean) => void,
  onContinue: () => void,
) => {
  try {
    const response = await AxiosClient.delete(
      `${ADMIN_PODCASTER_API_ROUTES.DELETE_PODCASTER}/${uuid}?role=PODCASTER`,
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

export const blockPodcaster = async (
  data: any,
  closeBlockUserPopup: () => void,
  onContinue: () => void,
  handleDisabled: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.put(
      `${ADMIN_PODCASTER_API_ROUTES.BLOCK_PODCASTER}`,
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

export const getActivePodcasterPlan = async (
  handleActivePodcasterPlan: (plan: IActivePlan) => void,
  userUuid: string,
) => {
  try {
    const response = await AxiosClient.get(
      `${ADMIN_PODCASTER_API_ROUTES.GET_ACTIVE_PLAN}/${userUuid}?role=PODCASTER`,
    );

    if (response?.data?.success) {
      handleActivePodcasterPlan(response?.data?.result);
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

export const getPodcasterPlans = async (
  handlePodcasterPlan: (plan: any, period: string) => void,
  period: string,
) => {
  try {
    const response = await AxiosClient.get(
      `${ADMIN_PODCASTER_API_ROUTES.GET_PLANS}?role=PODCASTER&period=${period}`,
    );

    if (response?.data?.success) {
      handlePodcasterPlan(response?.data?.result, period);
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

export const upgradePodcasterPlan = async (
  planUuid: string,
  userUuid: string,
  closeEditPlanPopup: () => void,
  onContinue: () => void,
  handleDisabled: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.put(
      `${ADMIN_PODCASTER_API_ROUTES.UPGRADE_PLAN}/${planUuid}/user/${userUuid}`,
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
