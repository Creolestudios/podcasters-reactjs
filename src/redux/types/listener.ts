import { ThunkDispatch } from 'redux-thunk';
import { SearchPodcastInterface } from '../../types/podcastInterface';
import { GET_SEARCH_PODCASTS, SET_PAGE, SET_SIZE } from '../constants/listener/listener';
import { SET_SEARCH_QUERY } from '../constants/podcaster/podcast';

export interface IPodcastHomeState {
  loading: boolean;
  error: any;
  data: {
    featuredPodcasts: Array<any>;
    continueListeningEpisodes: Array<any>;
    categories: Array<any>;
    subscribedPodcaster: Array<any>;
    newlyAddedPodcast: Array<any>;
    topTenPodcast: Array<any>;
    sentiments: Array<any>;
    listenAgainPodcasts: Array<any>;
    podcastYouFollow: Array<any>;
    podcasters: Array<any>;
    podcastMayLikeDetails: Array<any>;
  };
}
export interface IPodcastSearchState {
  podcasts: SearchPodcastInterface[];
  page: number;
  size: number;
  search: string;
  total: number | null;
  filterTotal: number | null;
  hasPodcasts: boolean;
}

export interface IGetPodcastsByListenerSearchPyaload {
  podcasts: SearchPodcastInterface[];
  total: number;
}

export type getListernerSearchedPodcast = {
  type: typeof GET_SEARCH_PODCASTS;
  payload: IGetPodcastsByListenerSearchPyaload;
};

export type SetSearchQueryAction = {
  type: typeof SET_SEARCH_QUERY;
  payload: string;
};
export type SetPageAction = {
  type: typeof SET_PAGE;
  payload: number;
};
export type SetSizeAction = {
  type: typeof SET_SIZE;
  payload: number;
};

export type ListenerPodcastActions =
  | getListernerSearchedPodcast
  | SetSearchQueryAction
  | SetPageAction
  | SetSizeAction;

export type ListenerState = IPodcastHomeState | IPodcastSearchState;

export type ListenerPodcastDispatch = ThunkDispatch<ListenerState, void, ListenerPodcastActions>;
