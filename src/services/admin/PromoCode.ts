import { TOASTER_STATUS } from '../../constant';
import { ADMIN_PROMOCODE_API_ROUTES } from '../../constant/apiRoute';
import { IPromoCode } from '../../types/admin';
import { showToastMessage } from '../../utils';
import AxiosClient from '../AxiosClient';

export const getPromoCodeDetails = async (
  handlePromoCodeDetail: (episodeDetails: any) => void,
  handleLoading: (value: boolean) => void,
  page: number = 1,
  size: number = 8,
) => {
  try {
    const response = await AxiosClient.get(
      `${ADMIN_PROMOCODE_API_ROUTES.GET_PROMOCODE}?page=${page - 1}&size=${size}`,
    );

    if (response?.data?.success) {
      handlePromoCodeDetail(response?.data?.result);
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

export const addPromoCode = async (
  data: IPromoCode,
  handleLoading: (value: boolean) => void,
  onContinue: () => void,
) => {
  try {
    const response = await AxiosClient.post(`${ADMIN_PROMOCODE_API_ROUTES.ADD_PROMOCODE}`, data);
    if (response?.data?.success) {
      if (response?.data?.result?.message) {
        showToastMessage(TOASTER_STATUS.ERROR, response?.data?.result?.message);
      } else {
        showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
        onContinue();
      }
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.developerMessage || error?.response?.data?.result?.message || error?.message,
    );
  } finally {
    handleLoading(false);
  }
};

export const deletePromoCode = async (
  uuid: string,
  handleLoading: (value: boolean) =>void,
  onContinue: () => void,
) => {
  try {
    const response = await AxiosClient.delete(
      `${ADMIN_PROMOCODE_API_ROUTES.DELETE_PROMOCODE}/${uuid}`,
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
  }
};
