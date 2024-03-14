import { TOASTER_STATUS } from '../../../constant';
import {
  getContinueListeningEpisodes,
  getFeaturedPodcasts,
  getNewlyAddedPodcast,
  getPodcastYouFollow,
  getPodcaster,
  getSentiments,
  getSubscribedPodcastandPodcaster,
  getTopCategories,
  getTopTenPodcast,
  listenAgain,
  podcastMayLike,
  listenerSearch,
} from '../../../services/listener/Podcast';
import { getLocalStorage, showToastMessage } from '../../../utils';
import {
  FETCH_HOME_PAGE_DATA_ERROR,
  FETCH_HOME_PAGE_DATA_START,
  FETCH_HOME_PAGE_DATA_SUCCESS,
  GET_SEARCH_PODCASTS,
  SET_SEARCH_QUERY,
  SET_SIZE,
} from '../../constants/listener/listener';
import { ListenerPodcastDispatch } from '../../types/listener';
import { UserGetState } from '../../types/user';

export function getPodcastsBySearchAction(
  search: string,
  page: number,
  size: number,
  handleLoading: (value: boolean) => void,
) {
  return async (dispatch: ListenerPodcastDispatch) => {
    try {
      const response = await listenerSearch(search, page, size);
      if (response.data.success) {
        dispatch({
          type: GET_SEARCH_PODCASTS,
          payload: {
            podcasts: response.data.result.data,
            total: response.data.result.recordsTotal,
            filterTotal: response.data.result.recordsFiltered,
            size,
          },
        });
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
      }
    } catch (error: any) {
      showToastMessage(TOASTER_STATUS.ERROR, error.message);
    } finally {
      handleLoading(false);
    }
  };
}

export function setSearchQueryAction(query: string) {
  return async (dispatch: ListenerPodcastDispatch) => {
    dispatch({
      type: SET_SEARCH_QUERY,
      payload: query,
    });
  };
}
export function setSizeAction(size: number) {
  return async (dispatch: ListenerPodcastDispatch) => dispatch({
    type: SET_SIZE,
    payload: size,
  });
}

export const fetchHomePageData = () => async (dispatch: any, getState: UserGetState) => {
  try {
    const isAuthenticated = getLocalStorage('accessToken');
    dispatch({ type: FETCH_HOME_PAGE_DATA_START });
    if (!isAuthenticated) {
      const [
        featuredPodcast,
        categories,
        newlyAddedPodcast,
        topTenPodcast,
        sentiments,
        podcasters,
        podcastMayLikeDetails,
      ] = await Promise.all([
        getFeaturedPodcasts(),
        getTopCategories(),
        getNewlyAddedPodcast(),
        getTopTenPodcast(),
        getSentiments(),
        getPodcaster(),
        podcastMayLike(),
      ]);

      dispatch({
        type: FETCH_HOME_PAGE_DATA_SUCCESS,
        payload: {
          featuredPodcasts: featuredPodcast?.data?.result?.data,
          categories: categories?.data?.result?.data,
          newlyAddedPodcast: newlyAddedPodcast?.data?.result?.data,
          topTenPodcast: topTenPodcast?.data?.result?.data,
          sentiments: sentiments?.data?.result?.data,
          podcasters: podcasters?.data?.result?.data,
          podcastMayLikeDetails: podcastMayLikeDetails?.data?.result?.data,
        },
      });
    } else {
      const [
        featuredPodcast,
        continueListeningEpisodes,
        categories,
        subscribedPodcaster,
        newlyAddedPodcast,
        topTenPodcast,
        sentiments,
        listenAgainPodcasts,
        podcastYouFollow,
        podcasters,
        podcastMayLikeDetails,
      ] = await Promise.all([
        getFeaturedPodcasts(),
        getContinueListeningEpisodes(),
        getTopCategories(),
        getSubscribedPodcastandPodcaster(false),
        getNewlyAddedPodcast(),
        getTopTenPodcast(),
        getSentiments(),
        listenAgain(),
        getPodcastYouFollow(),
        getPodcaster(),
        podcastMayLike(),
      ]);

      dispatch({
        type: FETCH_HOME_PAGE_DATA_SUCCESS,
        payload: {
          featuredPodcasts: featuredPodcast?.data?.result?.data,
          continueListeningEpisodes: continueListeningEpisodes?.data?.result?.data,
          categories: categories?.data?.result?.data,
          subscribedPodcaster: subscribedPodcaster?.data?.result?.data,
          newlyAddedPodcast: newlyAddedPodcast?.data?.result?.data,
          topTenPodcast: topTenPodcast?.data?.result?.data,
          sentiments: sentiments?.data?.result?.data,
          listenAgainPodcasts: listenAgainPodcasts?.data?.result?.data,
          podcastYouFollow: podcastYouFollow?.data?.result?.data,
          podcasters: podcasters?.data?.result?.data,
          podcastMayLikeDetails: podcastMayLikeDetails?.data?.result?.data,
        },
      });
    }
  } catch (error: any) {
    dispatch({ type: FETCH_HOME_PAGE_DATA_ERROR, payload: error.message });
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};
