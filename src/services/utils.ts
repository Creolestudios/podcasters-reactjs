import AxiosClient from './AxiosClient';
import { showToastMessage } from '../utils';
import { TOASTER_STATUS } from '../constant';

export const get = async (
  url: string,
  handleResponse: (response: any) => void,
  handleFinally?: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.get(url);

    if (response.data.success) {
      handleResponse(response.data.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  } finally {
    if (handleFinally) {
      handleFinally(false);
    }
  }
};

export const calculateUploadPercentage = (data:any) => Math.floor((100 * data.loaded) / data.total);
