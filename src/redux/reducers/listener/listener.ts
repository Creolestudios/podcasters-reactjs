import {
  FETCH_HOME_PAGE_DATA_ERROR,
  FETCH_HOME_PAGE_DATA_START,
  FETCH_HOME_PAGE_DATA_SUCCESS,
} from '../../constants/listener/listener';
import { IPodcastHomeState } from '../../types/listener';

const initialState: IPodcastHomeState = {
  loading: false,
  error: null,
  data: {
    featuredPodcasts: [],
    continueListeningEpisodes: [],
    categories: [],
    subscribedPodcaster: [],
    newlyAddedPodcast: [],
    topTenPodcast: [],
    sentiments: [],
    listenAgainPodcasts: [],
    podcastYouFollow: [],
    podcasters: [],
    podcastMayLikeDetails: [],
  },
};
// eslint-disable-next-line
const homePageData = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_HOME_PAGE_DATA_START:
      return { ...state, loading: true, error: null };
    case FETCH_HOME_PAGE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_HOME_PAGE_DATA_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default homePageData;
