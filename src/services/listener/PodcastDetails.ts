import AxiosClient from '../AxiosClient';
import { LISTNER_PODCAST_API_ROUTES } from '../../constant/apiRoute';
import { showToastMessage } from '../../utils';
import { TOASTER_STATUS } from '../../constant';
import { IPodcastDetails } from '../../types/listener';

export const getPodcastsWithEpisode = async (
  handlePodcastDetail: (podcastDetails: IPodcastDetails) => void,
  handleLoading: (value: boolean) => void,
  slugUrl: string,
) => {
  try {
    const response = await AxiosClient(
      `${LISTNER_PODCAST_API_ROUTES.GET_PODCAST_WITH_EPISODE}/${slugUrl}`,
    );

    if (response.data.success) {
      handlePodcastDetail(response.data.result);
      handleLoading(false);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};

export const subscribeUnscribePodcast = async (
  handleSubscribeDetail: (value: boolean) => void,
  podcastUuid: string,
  subscribe: boolean,
) => {
  try {
    const response = await AxiosClient.put(
      `${LISTNER_PODCAST_API_ROUTES.SUBSCRIBE_FAVORITE}/${podcastUuid}/subscribed/${subscribe}`,
    );

    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, subscribe ? 'Subscribed Successfully' : 'Unsubscribed Successfully');
      handleSubscribeDetail(subscribe);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};

export const favoritePodcast = async (
  handleFavoriteDetail: (value: boolean) => void,
  podcastUuid: string,
  favorite: boolean,
) => {
  try {
    const response = await AxiosClient.put(
      `${LISTNER_PODCAST_API_ROUTES.SUBSCRIBE_FAVORITE}/${podcastUuid}/favorite/${favorite}`,
    );
    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
      handleFavoriteDetail(favorite);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};

export const getFavoriteAndSubscribePodcastDetails = async (
  handleFavoriteAndSubscribeDetails: (favoriteAndSubscribe: any) => void,
  podcastUuid: string,
) => {
  try {
    const response = await AxiosClient(
      `${LISTNER_PODCAST_API_ROUTES.SUBSCRIBE_FAVORITE}/${podcastUuid}`,
    );
    if (response?.data?.success) {
      handleFavoriteAndSubscribeDetails(response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};

export const ratePodcast = async (podcastUuid: string, rating: number) => {
  try {
    const response = await AxiosClient.put(`${LISTNER_PODCAST_API_ROUTES.PODCAST_RATING}`, {
      podcastId: podcastUuid,
      rating,
    });
    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};

export const getRatingPodcast = async (
  handlePodcastRatingDetail: (details: any) => void,
  podcastUuid: string,
) => {
  try {
    const response = await AxiosClient(
      `${LISTNER_PODCAST_API_ROUTES.PODCAST_RATING}/${podcastUuid}`,
    );
    if (response?.data?.success) {
      handlePodcastRatingDetail(response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};

export const subscribeUnscribeAuthor = async (
  handleSubscribeDetail: (value: boolean) => void,
  authorUuid: string,
  subscribe: boolean,
) => {
  try {
    const response = await AxiosClient.put(
      `${LISTNER_PODCAST_API_ROUTES.AUTHOR_SUBSCRIBE_RATING}/${authorUuid}/subscribe/${subscribe}`,
    );

    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, subscribe ? 'Subscribed Successfully' : 'Unsubscribed Successfully');
      handleSubscribeDetail(subscribe);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};

export const rateAuthor = async (
  handleAuthorDetails: (avgAuthorRating: number, selectedRating: number) => void,
  authorUuid: string,
  rating: number,
) => {
  try {
    const response = await AxiosClient.put(
      `${LISTNER_PODCAST_API_ROUTES.AUTHOR_SUBSCRIBE_RATING}/rating`,
      {
        authorUuid,
        rating,
      },
    );
    if (response?.data?.success) {
      handleAuthorDetails(response?.data?.result?.avgAuthorRating, rating);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};

export const getAuthorSubscirbeAndRatingDetails = async (
  handleSubscribeAndRatingDetail: (details: any) => void,
  authorUuid: string,
) => {
  try {
    const response = await AxiosClient(
      `${LISTNER_PODCAST_API_ROUTES.AUTHOR_SUBSCRIBE_RATING}/${authorUuid}`,
    );
    if (response?.data?.success) {
      handleSubscribeAndRatingDetail(response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};

export const getEpisodes = async (
  handleEpisodesDetails: (details: any) => void,
  slugUrl: string,
  page: number = 0,
  size: number = 10,
) => {
  try {
    const response = await AxiosClient(
      `${LISTNER_PODCAST_API_ROUTES.GET_EPISODES}/${slugUrl}?page=${page}&size=${size}`,
    );
    if (response?.data?.success) {
      handleEpisodesDetails(response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error?.message);
  }
};
