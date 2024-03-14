import {
  IPodcast,
  IPodcastsFilter,
  IPodcastsFilterItem,
  IPodcastsFilterParams,
} from '../../../types/podcaster';
import {
  GET_PODCASTS_BY_PODCASTER,
  GET_PODCASTS_FILTER,
  RESET_PAGE,
  RESET_PODCASTS_FILTER,
  SET_PAGE,
  SET_PODCASTS_FILTER,
  SET_PODCAST_STATUS,
  SET_SEARCH_QUERY,
} from '../../constants/podcaster/podcast';
import { IPodcastState } from '../../types/podcast';

const initialPodcast: IPodcast = {
  categoryId: 0,
  categoryName: '',
  episodeCount: 0,
  name: '',
  podcastLanguage: '',
  podcastStatus: '',
  podcastTypeId: 0,
  podcastTypeName: '',
  podcastRating: 0,
  slugUrl: null,
  uuid: null,
  viewsCount: 0,
};

const initialFilterItem: IPodcastsFilterItem = {
  uuid: null,
  name: '',
  priority: null,
};

const initialFilter: IPodcastsFilter = {
  podcastCategories: [initialFilterItem],
  podcastTypes: [initialFilterItem],
  podcastLanguages: [''],
  podcastStatuses: [''],
};

const initialFilterParams: IPodcastsFilterParams = {
  categoryUuid: [],
  typeUuid: [],
  language: [],
  podcastStatus: [],
  startDate: null,
  endDate: null,
  featured: false,
};

const initialState: IPodcastState = {
  podcasts: [initialPodcast],
  page: 1,
  size: 10,
  search: '',
  sortColumnId: 'id',
  sortDirection: 'desc',
  total: null,
  hasPodcasts: false,
  filter: initialFilter,
  filterParams: initialFilterParams,
};

// eslint-disable-next-line
const podcast = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_PODCASTS_BY_PODCASTER:
      return {
        ...state,
        podcasts: action.payload.podcasts,
        total: action.payload.total,
      };

    case SET_SEARCH_QUERY:
      return {
        ...state,
        search: action.payload,
        page: 1,
      };

    case SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };

    case SET_PODCAST_STATUS:
      return {
        ...state,
        hasPodcasts: !!(state.podcasts.length > 0 && state.podcasts[0].uuid),
      };

    case GET_PODCASTS_FILTER:
      return {
        ...state,
        filter: action.payload,
      };

    case SET_PODCASTS_FILTER:
      return {
        ...state,
        filterParams: {
          ...initialFilterParams,
          [action.payload.parentItem.paramsLabel]:
            typeof action.payload.value === 'boolean'
              ? action.payload.value
              : [action.payload.value],
        },
        page: 1,
      };

    case RESET_PODCASTS_FILTER:
      return {
        ...state,
        filterParams: initialFilterParams,
      };

    case RESET_PAGE:
      return {
        ...state,
        page: 1,
      };

    default:
      return state;
  }
};

export default podcast;
