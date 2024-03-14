import axios from 'axios';
import AxiosClient from '../AxiosClient';
import { AUDIO_EDITOR_API_ROUTES } from '../../constant/apiRoute';
import {
  downloadFileFromUrl,
  showToastMessage,
  convertLinearToDecibel,
  downloadAudioFile,
} from '../../utils';
import { PODCAST_STATUS, TOASTER_STATUS } from '../../constant';
import { uploadAudioFile } from '../../components/Action/Image&AudioUpload';
import {
  AWS_API_KEY,
  AWS_BASE_URL,
  EXPORT_SPECIFIC_FORMAT_AUDIO,
  MERGE_AUDIO,
} from '../../clientConfig';

export const getAudiosByEpisodeId = (id: string) => AxiosClient.get(`${AUDIO_EDITOR_API_ROUTES.GET_EPISODE_AUDIOS}/${id}`);

export const getEpisodeList = () => AxiosClient.get(AUDIO_EDITOR_API_ROUTES.GET_EPISODE_LIST);

export const getAllMusic = () => AxiosClient.get(AUDIO_EDITOR_API_ROUTES.GET_ALL_MUSIC);

export const updateEpisodeAudioTracks = async (
  episodeId: string,
  handleGetAudios: () => void,
  handleLoading: (value: boolean) => void,
  data: any,
) => {
  try {
    const response = await AxiosClient.put(
      `${AUDIO_EDITOR_API_ROUTES.UPDATE_EPISODE_AUDIO_TRACKS}/${episodeId}`,
      data,
    );

    if (response.data.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response.data.result);
      handleGetAudios();
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

export const uploadAudioOnAWS = async (item: any): Promise<any> => {
  if (item.url.includes('blob')) {
    return AxiosClient.post(`${AUDIO_EDITOR_API_ROUTES.GET_PRESIGNED_URL}.wav`)
      .then((presignedResponse) => {
        if (presignedResponse.data.success) {
          const { signedUrl, fileUrl } = presignedResponse.data.result;

          return fetch(item.url)
            .then((response) => response.blob())
            .then((blobData) => uploadAudioFile(signedUrl, blobData).then((uploadResponse) => ({
              ...item,
              url: fileUrl,
            })))
            .catch((error) => {
              throw new Error(error);
            });
        }
        throw new Error(presignedResponse.data.error.txt ?? 'Network Error');
      })
      .catch((error: any) => {
        throw new Error(error);
      });
  }
  return Promise.resolve(item);
};

const convertTrackToPayload = (
  index: number,
  item: any,
  audioControls: any,
) => {
  const newItem: any = {
    name: item.name,
    url: item.url,
    duration: item.duration,
    volume: audioControls[index].volumeLabel * 10,
    speed: audioControls[index].speed,
    startPosition: audioControls[index].startPosition,
    locked: audioControls[index].isLocked,
    startTime: audioControls[index].startTime,
    musicUuid: null,
  };

  if (Object.keys(item).includes('uuid')) {
    newItem.uuid = item.uuid;
  }

  if (Object.keys(item).includes('musicUuid')) {
    newItem.musicUuid = item.musicUuid;
  }

  if (newItem.url.includes('https')) {
    if (index !== 0) {
      const urlList = newItem.url.split('audio-editor');
      newItem.url = urlList.at(-1).startsWith('/')
        ? `audio-editor${urlList.at(-1)}`
        : `audio-editor/${urlList.at(-1)}`;
    } else {
      const urlList = newItem.url.split('net/');
      newItem.url = urlList.at(-1);
    }
  }

  return newItem;
};

export const saveEpisodeTracksInDraft = async (
  episodeId: string,
  audioTracksData: any,
  deleteTracksData: any,
  audioControls: any,
  handleLoading: (value: boolean) => void,
  handleGetAudios: () => void,
) => {
  try {
    const responses = await Promise.all(audioTracksData.map(uploadAudioOnAWS));

    if (responses.length === audioTracksData.length) {
      const saveTracks = responses.map((item: any, index: number) => {
        const payloadItem = convertTrackToPayload(index, item, audioControls);

        return payloadItem;
      });

      updateEpisodeAudioTracks(episodeId, handleGetAudios, handleLoading, {
        saveTracks,
        deleteTracks: deleteTracksData,
      });
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, 'Network Error');
      handleLoading(false);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage
        ?? error?.message
        ?? 'Network Error',
    );
    handleLoading(false);
  }
};

export const getTranscriptByEpisodeUuid = async (
  id: string,
  handleSuccess: (type: string, data: string) => void,
  handleLoading: (value: boolean) => void,
  type: string,
) => {
  try {
    const response = await AxiosClient.get(
      `${AUDIO_EDITOR_API_ROUTES.GET_TRANSCRIPT_BY_EPISODE_UUID}/${id}`,
    );

    if (response.data.success) {
      handleSuccess(
        type,
        type.toLowerCase() === 'transcript'
          ? response.data.result.transcriptData
          : response.data.result.summary,
      );
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage
        ?? error?.message
        ?? 'Network Error',
    );
  } finally {
    handleLoading(false);
  }
};

export const exportPdfReport = async (
  id: string,
  type: string,
  handleLoading: (value: boolean) => void,
  name: string,
) => {
  try {
    const response = await AxiosClient.post(
      `${
        AUDIO_EDITOR_API_ROUTES.GENERATE_REPORT_PDF
      }${id}?generateType=${type.toUpperCase()}`,
      {},
      {
        responseType: 'blob', // Set responseType as blob object
      },
    );

    // Create blob Object
    const blob = new Blob([response.data]);

    // Convert blob Object into url
    const blobUrl = URL.createObjectURL(blob);

    downloadFileFromUrl('pdf', blobUrl, name);
    URL.revokeObjectURL(blobUrl);
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage
        ?? error?.message
        ?? 'Network Error',
    );
  } finally {
    handleLoading(false);
  }
};

export const deleteTracksFromEditor = async (
  episodeId: string,
  redirect: () => void,
) => {
  try {
    const response = await AxiosClient.delete(
      `${AUDIO_EDITOR_API_ROUTES.GET_EPISODE_AUDIOS}/${episodeId}/${AUDIO_EDITOR_API_ROUTES.DELETE_TRACKS}`,
    );

    if (response.data.success) {
      redirect();
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage
        ?? error?.message
        ?? 'Network Error',
    );
  }
};

export const finalizeAudio = async (
  episodeId: string,
  audioTracksData: any,
  audioControls: any,
  handleLoading: (value: boolean) => void,
  redirect: () => void,
) => {
  try {
    const responses = await Promise.all(audioTracksData.map(uploadAudioOnAWS));

    if (responses.length === audioTracksData.length) {
      const backgroundTracks = responses.slice(1).map((responseItem) => {
        if (responseItem.url.includes('https')) {
          return { ...responseItem, url: responseItem.url.split('net/')[1] };
        }

        return responseItem;
      });

      const payload = {
        episode_uuid: episodeId,
        main_audio_key: responses[0].url.split('net/')[1],
        decibels: convertLinearToDecibel(audioControls[0].volumeLabel * 10),
        background_audio_info: backgroundTracks.map(
          (track: any, index: number) => ({
            key: track.url,
            start_time: audioControls[index + 1].startTime,
            decibels: convertLinearToDecibel(
              audioControls[index + 1].volumeLabel * 10,
            ),
          }),
        ),
      };

      const mergeResponse = await axios.post(
        `${AWS_BASE_URL}${MERGE_AUDIO}`,
        payload,
        {
          headers: {
            'x-api-key': AWS_API_KEY,
          },
        },
      );

      if (mergeResponse.data.status === 'merge') {
        await deleteTracksFromEditor(episodeId, redirect);
        // redirect();
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, mergeResponse.data.error.txt);
      }
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, 'Network Error');
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage
        ?? error?.message
        ?? 'Network Error',
    );
  } finally {
    handleLoading(false);
  }
};

const downloadAudio = async (
  episodeId: string,
  format: string,
  name: string,
) => {
  try {
    const exportResponse = await AxiosClient.get(
      `${AUDIO_EDITOR_API_ROUTES.EXPORT_AUDIO}/${episodeId}`,
    );

    if (exportResponse.data.success) {
      const { fileUrl } = exportResponse.data.result;

      downloadAudioFile(format.toLowerCase(), fileUrl, name);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, exportResponse.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage
        ?? error?.message
        ?? 'Network Error',
    );
  }
};

export const exportAudio = async (
  format: string,
  quality: string,
  episodeId: string,
  audioTrack: any,
  name: string,
) => {
  try {
    const payload = {
      format: format.toLowerCase(),
      quality: `${quality.split(' ')[0]}k`,
      episode_uuid: episodeId,
      input_file: audioTrack.split('net/')[1],
      output_file: `${name}.${format.toLowerCase()}`,
    };

    const response = await axios.post(
      `${AWS_BASE_URL}${EXPORT_SPECIFIC_FORMAT_AUDIO}`,
      payload,
      {
        headers: {
          'x-api-key': AWS_API_KEY,
        },
      },
    );

    if (response.status === 200) {
      setTimeout(downloadAudio.bind(null, episodeId, format, name), 5000);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, 'Network Error');
    }
  } catch (error: any) {
    if (error?.response?.data.message === 'Endpoint request timed out') {
      setTimeout(downloadAudio.bind(null, episodeId, format, name), 5000);
    } else {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        error?.response?.data?.result?.errorMessage
          ?? error?.message
          ?? 'Network Error',
      );
    }
  }
};
