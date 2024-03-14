import { TOASTER_STATUS } from '../../constant';
import { LISTENER_EPISODE_API_ROUTES } from '../../constant/apiRoute';
import { showToastMessage } from '../../utils';
import AxiosClient from '../AxiosClient';

export const getEpisodeDetails = async (
  handleEpisodeDetail: (episodeDetails: any) => void,
  handleLoading: (value: boolean) => void,
  uuid: string,
) => {
  try {
    const response = await AxiosClient(`${LISTENER_EPISODE_API_ROUTES.EPISODE}/${uuid}`);

    if (response.data.success) {
      handleEpisodeDetail(response.data.result);
      handleLoading(false);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};

export const getComments = async (
  handleCommentDetail: (commentDetails: any) => void,
  episodeUuid: string,
  page: number = 0,
  size: number = 2,
) => {
  try {
    const response = await AxiosClient(
      `${LISTENER_EPISODE_API_ROUTES.GET_COMMENTS}/${episodeUuid}?page=${page}&size=${size}`,
    );

    if (response.data.success) {
      handleCommentDetail(response.data.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};

export const addComment = async (
  handleCommentDetail: (commentDetails: any) => void,
  removeCommentText: () => void,
  handleCommnentDisabled: (value: boolean) => void,
  episodeUuid: string,
  commentMessage: string,
) => {
  try {
    const response = await AxiosClient.post(`${LISTENER_EPISODE_API_ROUTES.ADD_COMMENT}`, {
      episodeUuid,
      commentMessage,
    });

    if (response.data.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response.data.result);
      removeCommentText();
      getComments(handleCommentDetail, episodeUuid);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  } finally {
    handleCommnentDisabled(false);
  }
};

export const reportComment = async (
  episodeCommentId: string,
  handleCommentDetail: (commentDetails: any) => void,
  episodeUuid: string,
  setLoadingState: (value: boolean) => void,
) => {
  try {
    setLoadingState(true);
    const response = await AxiosClient.post(
      `${LISTENER_EPISODE_API_ROUTES.REPORT_COMMENT}/${episodeCommentId}`,
    );
    if (response.data.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response.data.result);
      getComments(handleCommentDetail, episodeUuid);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
    setLoadingState(false);
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.response.data.result.developerMessage);
    setLoadingState(false);
  }
};

export const deleteComment = async (
  commentUuid: string,
  handleDisable: (value: boolean) => void,
  doGetComments: () => void,
) => {
  try {
    const response = await AxiosClient.delete(
      `${LISTENER_EPISODE_API_ROUTES.DELETE_COMMENT}/${commentUuid}`,
    );
    if (response?.data?.success) {
      doGetComments();
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage || error.message,
    );
  } finally {
    handleDisable(false);
  }
};

export const likeEpisode = async (
  handleLike: (liked: boolean, count: number) => void,
  episodeCommentId: string,
  like: boolean,
) => {
  try {
    const response = await AxiosClient.put(
      `${LISTENER_EPISODE_API_ROUTES.EPISODE_ANALYTICS}/${episodeCommentId}/like/${like}`,
    );
    if (response?.data?.success) {
      handleLike(like, response?.data?.result?.likeCount);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};

export const episodePlayed = async (
  episodeUuid: string,
  duration: number,
  userCookieId: number,
) => {
  try {
    const response = await AxiosClient.put(`${LISTENER_EPISODE_API_ROUTES.EPISODE_PLAYED}`, {
      episodeUuid,
      duration,
      userCookieId,
    });
    if (!response.data.success) {
      console.error(response?.data?.error?.txt);
    }
  } catch (error: any) {
    console.error(error?.response?.data?.result?.errorMessage ?? error.message);
  }
};

export const getNextEpisodes = async (
  handlenextEpisodesDetails: (details: any) => void,
  episodeUuid: string,
  page: number = 0,
  size: number = 10,
) => {
  try {
    const response = await AxiosClient(
      `${LISTENER_EPISODE_API_ROUTES.GET_EPISODES}/${episodeUuid}?page=${page}&size=${size}`,
    );
    if (response?.data?.success) {
      handlenextEpisodesDetails(response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};

export const episodeDownload = async (episodeUuid: string) => AxiosClient.put(`${LISTENER_EPISODE_API_ROUTES.EPISODE_ANALYTICS}/${episodeUuid}/download/true`);
