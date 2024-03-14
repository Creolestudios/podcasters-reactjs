import { SearchPodcastInterface } from '../../../types/podcastInterface';
import { GET_SEARCH_PODCASTS, SET_PAGE, SET_SIZE } from '../../constants/listener/listener';
import { SET_SEARCH_QUERY } from '../../constants/podcaster/podcast';
import { IPodcastSearchState } from '../../types/listener';

const searchedPodcast: SearchPodcastInterface = {
  uuid: '',
  name: '',
  description: '',
  podcastStatus: '',
  publishedDate: 0,
  user: {
    uuid: '',
    firstName: '',
    lastName: '',
    email: '',
    profilePhotoUrl: '',
    bio: '',
    averageRating: '',
    podcastCount: '',
    episodeCount: '',
    allMonetizedAllPodcast: false,
  },
  podcastTags: [],
  slugUrl: '',
  averageRating: 0,
  numberOfViews: 0,
  monetized: false,
};

const initialState: IPodcastSearchState = {
  podcasts: [searchedPodcast],
  page: 0,
  size: 10,
  search: '',
  total: null,
  filterTotal: null,
  hasPodcasts: false,
};
// eslint-disable-next-line
const searchPodcast = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_SEARCH_PODCASTS:
      return {
        ...state,
        podcasts: action.payload.podcasts,
        total: action.payload.total,
        filterTotal: action.payload.filterTotal,
        size: action.payload.size,
      };
    case SET_SEARCH_QUERY:
      return {
        ...state,
        search: action.payload,
      };
    case SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };

    case SET_SIZE:
      return {
        ...state,
        size: action.payload,
      };

    default:
      return state;
  }
};

export default searchPodcast;
