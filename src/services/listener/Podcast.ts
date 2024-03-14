import {
  LISTENER_EPISODE_API_ROUTES,
  LISTENER_HOME_API_ROUTES,
  LISTNER_PODCAST_API_ROUTES,
} from '../../constant/apiRoute';
import AxiosClient from '../AxiosClient';
import { showToastMessage } from '../../utils';
import { TOASTER_STATUS } from '../../constant';

export const getFeaturedPodcasts = async (
  search: string = '',
  page: number = 0,
  size: number = 10,
  sortColumnId: string = 'id',
  sortDirection: string = 'asc',
) => AxiosClient(
  `${LISTENER_HOME_API_ROUTES.FEATURED_PODCAST}?searchString=${search}&page=${page}&size=${size}&sortColumn=${sortColumnId}&sortDirection=${sortDirection}`,
);

export const getContinueListeningEpisodes = async (page: number = 0, size: number = 10) => AxiosClient(`${LISTENER_HOME_API_ROUTES.CONTINUE_LISTEN_EPISODE}?page=${page}&size=${size}`);

export const getTopCategories = async (search: string = '') => AxiosClient(`${LISTENER_HOME_API_ROUTES.GET_CATEGORIES}?searchString=${search}`);

export const getSubscribedPodcastandPodcaster = async (
  podcasts: boolean,
  page: number = 0,
  size: number = 10,
) => AxiosClient(
  `${LISTENER_HOME_API_ROUTES.GET_SUBSCRIBED_PODCAST}/${podcasts}?page=${page}&size=${size}`,
);

export const getNewlyAddedPodcast = async (page: number = 0, size: number = 10) => AxiosClient(`${LISTENER_HOME_API_ROUTES.NEWLY_ADDED_PODCAST}?page=${page}&size=${size}`);

export const getTopTenPodcast = async (page: number = 0, size: number = 10) => AxiosClient(`${LISTENER_HOME_API_ROUTES.TOP_PODCAST}?page=${page}&size=${size}`);

export const getSentiments = async (page: number = 0, size: number = 10) => AxiosClient(`${LISTENER_HOME_API_ROUTES.GET_SENTIMENTS}?page=${page}&size=${size}`);

export const listenAgain = async (page: number = 0, size: number = 10) => AxiosClient(`${LISTENER_HOME_API_ROUTES.LISTEN_AGAIN_PODCAST}?page=${page}&size=${size}`);

export const podcastMayLike = async (page: number = 0, size: number = 10) => AxiosClient(`${LISTENER_HOME_API_ROUTES.PODCASTS_MAY_LIKE}?page=${page}&size=${size}`);

export const getPodcaster = async (page: number = 0, size: number = 10) => AxiosClient(`${LISTENER_HOME_API_ROUTES.GET_PODCASTER}?page=${page}&size=${size}`);

export const getPodcastYouFollow = async (page: number = 0, size: number = 10) => AxiosClient(`${LISTENER_HOME_API_ROUTES.GET_PODCAST_YOU_FOLLOW}?page=${page}&size=${size}`);

export const listenerSearch = async (
  searchValue: string = '',
  page: number = 0,
  size: number = 10,
) => AxiosClient(
  `${LISTENER_HOME_API_ROUTES.SEARCH}?searchString=${encodeURIComponent(
    searchValue,
  )}&page=${page}&size=${size}`,
);

export const getAllCategoriesData = async (page: number = 0, size: number = 10) => AxiosClient(`${LISTNER_PODCAST_API_ROUTES.CATEGORY_WITH_PODCAST}?page=${page}&size=${size}`);

export const getPodcastWithSentiments = async (page: number = 0, size: number = 10) => AxiosClient(`${LISTNER_PODCAST_API_ROUTES.PODCAST_WITH_SENTIMENTS}?page=${page}&size=${size}`);

export const getPodcastByCategoryId = async (
  categoryUuid: string,
  page: number = 0,
  size: number = 10,
) => AxiosClient(
  `${LISTNER_PODCAST_API_ROUTES.PODCAST_BY_CATEGORY}/${categoryUuid}?page=${page}&size=${size}`,
);

export const getCategoryData = async (endpoint: string, page: number = 0, size: number = 10) => AxiosClient(`api/v1/listener/${endpoint}?page=${page}&size=${size}`);

export const getPodcastBySentimentName = async (
  sentimentName: string,
  page: number = 0,
  size: number = 10,
) => AxiosClient(
  `${LISTENER_HOME_API_ROUTES.GET_SENTIMENTS}/${sentimentName}?page=${page}&size=${size}`,
);

export const getDownloadedEpisodes = async (
  handleEpisodeDetail: (episodeDetails: any) => void,
  handleSizeOfData: (size: number) => void,
  handleLoading: (value: boolean) => void,
  page: number = 0,
  size: number = 10,
  search: string = '',
  sortColumnId: string = 'id',
  sortDirection: string = 'asc',
) => {
  try {
    const response = await AxiosClient(
      `${LISTENER_EPISODE_API_ROUTES.GET_DOWNLOADED_EPISODES}?searchString=${encodeURIComponent(
        search,
      )}&page=${page}&size=${size}&sortColumn=${sortColumnId}&sortDirection=${sortDirection}`,
    );
    if (response?.data?.success) {
      handleEpisodeDetail(response?.data?.result);
      handleSizeOfData(size);
      handleLoading(false);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};

export const getPodcastHistory = async (
  handlePodcastDetail: (podcastDetails: any) => void,
  handleSizeOfData: (size: number) => void,
  handleLoading: (value: boolean) => void,
  page: number = 0,
  size: number = 10,
  searchString: string = '',
) => {
  try {
    const response = await AxiosClient(
      `${LISTNER_PODCAST_API_ROUTES.GET_PODCAST_HISTORY}?searchString=${searchString}&page=${page}&size=${size}`,
    );

    if (response.data.success) {
      handlePodcastDetail(response.data.result);
      handleSizeOfData(size);
      handleLoading(false);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};

export const getFavoritesPodcast = async (
  handlePodcastDetail: (podcastDetails: any) => void,
  handleSizeOfData: (size: number) => void,
  handleLoading: (value: boolean) => void,
  page: number = 0,
  size: number = 10,
  searchString: string = '',
) => {
  try {
    const response = await AxiosClient(
      `${LISTNER_PODCAST_API_ROUTES.GET_FAVORITES_PODCAST}?searchString=${encodeURIComponent(
        searchString,
      )}&page=${page}&size=${size}`,
    );

    if (response?.data?.success) {
      handlePodcastDetail(response?.data?.result);
      handleSizeOfData(size);
      handleLoading(false);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};

export const getPodcasterPodcasts = async (
  handlePodcastDetail: (podcastDetails: any) => void,
  handleSizeOfData: (size: number) => void,
  handleLoading: (value: boolean) => void,
  userUuid: string,
  page: number = 0,
  size: number = 10,
  searchString: string = '',
  sortColumn = 'id',
  sortDirection = 'desc',
) => {
  try {
    const response = await AxiosClient(
      `${
        LISTNER_PODCAST_API_ROUTES.GET_PODCASTER_PODCAST
      }/${userUuid}?searchString=${encodeURIComponent(
        searchString,
      )}&page=${page}&size=${size}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`,
    );

    if (response?.data?.success) {
      handlePodcastDetail(response?.data?.result);
      handleSizeOfData(size);
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
