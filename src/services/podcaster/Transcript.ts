import AxiosClient from '../AxiosClient';
import { showToastMessage } from '../../utils';
import { PODCASTER_TRANSCRIPT_API_ROUTES as TRANSCRIPT_API_ROUTES } from '../../constant/apiRoute';

import { TOASTER_STATUS } from '../../constant';

export const getTranscriptService = async (
  uuid: string,
  handleTranscript: (data: string, url: string) => void,
  handleLoading: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient(
      `${TRANSCRIPT_API_ROUTES.GET_TRANSCRIPT}/${uuid}`,
    );

    if (response.data.success) {
      handleTranscript(
        response.data.result.transcriptData,
        response.data.result.s3Url,
      );
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  } finally {
    handleLoading(false);
  }
};

export const updateTranscriptService = async (
  uuid: string,
  transcriptData: string,
  s3Url: string,
  handleTranscript: (data: string, url: string) => void,
  handleLoading: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.put(
      TRANSCRIPT_API_ROUTES.UPDATE_TRANSCRIPT,
      { transcriptData, s3Url, uuid },
    );

    if (response.data.success) {
      showToastMessage(
        TOASTER_STATUS.SUCCESS,
        'Transcript successfully updated !!',
      );
      getTranscriptService(uuid, handleTranscript, handleLoading);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};
