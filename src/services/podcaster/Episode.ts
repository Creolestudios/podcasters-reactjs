import AxiosClient from '../AxiosClient';
import { EPISODE_API_ROUTES } from '../../constant/apiRoute';
import {
  showToastMessage,
  getDateOrTimeFromStatus,
} from '../../utils';
import { TOASTER_STATUS } from '../../constant';
import { IEpisode, IEpisodeForm } from '../../types/episodeDataInterface';

export const uploadEpisodeImages = async (
  episodeUuid: string,
  thumbnailImage: File | string | null | Blob,
  coverImage: File | string | null | Blob,
  handlePageLoading: (value: boolean) => void,
) => {
  try {
    const formData: any = new FormData();
    if (coverImage || thumbnailImage) {
      formData.append('thumbnailImage', thumbnailImage);
      formData.append('coverImage', coverImage);
    }
    const response = await AxiosClient.post(
      `${EPISODE_API_ROUTES.UPLOAD_EPISODE_IMAGES}/${episodeUuid}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    if (response.data.success) {
      return true;
    }
    handlePageLoading(false);
    showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    return false;
  } catch (error: any) {
    handlePageLoading(false);
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
    return false;
  }
};

export const addEpisode = async (
  episode: IEpisode,
  thumbnailImage: File | string | null | Blob,
  coverImage: File | string | null | Blob,
  handleRedirect: (isAddUpdate: boolean) => void,
  handlePageLoading: (value: boolean) => void,
  isOpenEditor?: boolean,
  redirectToAudioEditor?: (id: string) => void,
) => {
  try {
    const response = await AxiosClient.post(
      EPISODE_API_ROUTES.ADD_EPISODE,
      episode,
    );

    if (response.data.success) {
      const episodeImages = await uploadEpisodeImages(
        response.data.result,
        thumbnailImage,
        coverImage,
        handlePageLoading,
      );

      if (episodeImages) {
        if (isOpenEditor && redirectToAudioEditor) {
          redirectToAudioEditor(response.data.result);
        } else {
          handleRedirect(true);
        }
      }
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  } finally {
    handlePageLoading(false);
  }
};

const doRedirect = (
  thumbnailImage: File | string | null | Blob,
  coverImage: File | string | null | Blob,
  episodeImagesResponse: any,
  handleRedirect: (isAddUpdate: boolean) => void,
  isOpenEditor?: boolean,
  redirectToAudioEditor?: (id: string) => void,
  episodeId?: string,
) => {
  switch (true) {
    case episodeImagesResponse:
      if (isOpenEditor && episodeId && redirectToAudioEditor) {
        redirectToAudioEditor(episodeId);
      } else {
        handleRedirect(true);
      }
      break;
    case typeof thumbnailImage === 'string' && typeof coverImage === 'string':
      if (isOpenEditor && episodeId && redirectToAudioEditor) {
        redirectToAudioEditor(episodeId);
      } else {
        handleRedirect(true);
      }
      break;
    case episodeImagesResponse && typeof coverImage === 'string':
      if (isOpenEditor && episodeId && redirectToAudioEditor) {
        redirectToAudioEditor(episodeId);
      } else {
        handleRedirect(true);
      }
      break;
    case typeof thumbnailImage === 'string' && episodeImagesResponse:
      if (isOpenEditor && episodeId && redirectToAudioEditor) {
        redirectToAudioEditor(episodeId);
      } else {
        handleRedirect(true);
      }
      break;
    default:
      break;
  }
};

export const updateEpisode = async (
  episode: IEpisode,
  thumbnailImage: File | string | null | Blob,
  coverImage: File | string | null | Blob,
  handleRedirect: (isAddUpdate: boolean) => void,
  handlePageLoading: (value: boolean) => void,
  pathName: string,
  isOpenEditor?: boolean,
  redirectToAudioEditor?: (id: string) => void,
) => {
  try {
    const response = await AxiosClient.put(
      `${EPISODE_API_ROUTES.UPDATE_EPISODE}/${pathName.split('/')?.at(-2)}`,
      episode,
    );

    if (response.data.success) {
      let episodeImagesResponse = null;

      episodeImagesResponse = await uploadEpisodeImages(
        response.data.result,
        typeof thumbnailImage !== 'string' ? thumbnailImage : null,
        typeof coverImage !== 'string' ? coverImage : null,
        handlePageLoading,
      );

      doRedirect(
        thumbnailImage,
        coverImage,
        episodeImagesResponse,
        handleRedirect,
        isOpenEditor,
        redirectToAudioEditor,
        pathName.split('/')?.at(-2),
      );
    } else {
      handlePageLoading(false);
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    handlePageLoading(false);
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  }
};

export const getEpisodeDetail = async (
  episodeId: string,
  handlePageLoading: (value: boolean) => void,
  handleEpisode: (value: IEpisodeForm) => void,
  handleTranscript: (value: any) => void,
) => {
  try {
    const response = await AxiosClient.get(
      `${EPISODE_API_ROUTES.GET_EPISODE}/${episodeId}`,
    );

    if (response.data.success) {
      const { tags } = response.data.result;
      const { sentimentNames } = response.data.result;
      const episode: IEpisodeForm = {
        thumbnail: response.data.result.thumbnailImage,
        cover: response.data.result.coverImage,
        episodeNo: response.data.result.episodeNo,
        episodeTitle: response.data.result.name,
        description: response.data.result.description,
        tags:
          tags?.length > 0
            ? tags.map((tag: any) => ({
              key: tag.uuid,
              value: tag.tagName,
            }))
            : [],
        episodeCountry: response.data.result.episodeCountry,
        date: getDateOrTimeFromStatus(
          response.data.result.episodePublishedOrScheduledDate,
          'YYYY-MM-DD',
          response.data.result.publishStatus,
        ),
        time: getDateOrTimeFromStatus(
          response.data.result.episodePublishedOrScheduledDate,
          'HH:mm',
          response.data.result.publishStatus,
        ),
        status: response.data.result.publishStatus,
        uploadedAudio: response.data.result.episodeUrl,
        enhancedAudio: null,
        blobUrl: null,
        recordedAudio: null,
        processedAudio: null,
        sentimentNames:
          sentimentNames?.length > 0
            ? sentimentNames.map((sentiment: any) => sentiment.sentimentName)
            : [],
        transcriptStatus: response.data.result.transcriptStatus,
        transcriptUuid: '',
      };

      handleEpisode(episode);
      handleTranscript({
        s3Url: response.data.result?.transcriptTransfer?.s3Url ?? '',
        transcriptData:
          response.data.result?.transcriptTransfer?.transcriptData ?? '',
        uuid: response.data.result?.transcriptTransfer?.uuid ?? '',
      });
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  } finally {
    handlePageLoading(false);
  }
};

export const deleteEpisode = async (
  episodeUuid: string,
  handleLoading: (value: boolean) => void,
  doGetEpisodes: () => void,
) => {
  try {
    const response = await AxiosClient.delete(
      `${EPISODE_API_ROUTES.DELETE_EPISODE}/${episodeUuid}`,
    );

    if (response?.data?.success) {
      doGetEpisodes();
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error?.message,
    );
  } finally {
    handleLoading(false);
  }
};

export const getUploadAudioDuration = async (userUUid:string, onContinue: (data: {totalAllowedEnhanced: number;
    totalAllowedUpload: number;
    usedEnhanced: number;
    usedUpload: number;}) => void) => {
  try {
    const response = await AxiosClient.get(
      `${EPISODE_API_ROUTES.UPLOAD_AUDIO_DURATION}/${userUUid}`,
    );

    if (response?.data?.success) {
      onContinue(response.data.result);
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

export const updateEnhanceDuration = async (
  enhancedDuration:number,
) => {
  const response = await AxiosClient.post(EPISODE_API_ROUTES.UPDATE_ENHANCE_DURATION, { enhancedDuration });
  return response?.data;
};
