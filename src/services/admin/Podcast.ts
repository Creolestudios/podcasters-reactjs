import { TOASTER_STATUS } from '../../constant';
import { ADMIN_PODCAST_API_ROUTES } from '../../constant/apiRoute';
import { showToastMessage } from '../../utils';
import AxiosClient from '../AxiosClient';

export const getPodcastbyPodcasterUuid = async (
  handlePodcastDetail: (episodeDetails: any) => void,
  handleLoading: (value: boolean) => void,
  podcasterUuid: string,
  page: number = 0,
  size: number = 8,
) => {
  try {
    const response = await AxiosClient.get(
      `${ADMIN_PODCAST_API_ROUTES.GET_PODCASTS}/${podcasterUuid}/podcasts?page=${page}&size=${size}`,
    );

    if (response?.data?.success) {
      handlePodcastDetail(response?.data?.result);
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

export const blockPodcast = async (
  data: any,
  closeBlockUserPopup: () => void,
  onContinue: () => void,
  handleDisabled: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.put(`${ADMIN_PODCAST_API_ROUTES.BLOCK_PODCAST}`, data);

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
