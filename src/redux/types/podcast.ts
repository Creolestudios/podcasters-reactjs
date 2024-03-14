import { ThunkDispatch } from 'redux-thunk';

import {
  GET_PODCASTS_BY_PODCASTER,
  GET_PODCASTS_FILTER,
  RESET_PAGE,
  RESET_PODCASTS_FILTER,
  SET_PAGE,
  SET_PODCASTS_FILTER,
  SET_PODCAST_STATUS,
  SET_SEARCH_QUERY,
} from '../constants/podcaster/podcast';
import {
  IPodcast,
  IPodcastsFilter,
  IPodcastsFilterParams,
} from '../../types/podcaster';
import { INestedSelectItem } from '../../components/Dropdown/NestedSelectWrapper';

export interface IPodcastState {
  podcasts: IPodcast[];
  page: number;
  size: number;
  search: string;
  sortColumnId: string;
  sortDirection: string;
  total: number | null;
  hasPodcasts: boolean;
  filter: IPodcastsFilter;
  filterParams: IPodcastsFilterParams;
}

export interface IGetPodcastsByPodcasterPyaload {
  podcasts: IPodcast[];
  total: number;
}

export type GetPodcastsByPodcasterAction = {
  type: typeof GET_PODCASTS_BY_PODCASTER;
  payload: IGetPodcastsByPodcasterPyaload;
};

export type SetSearchQueryAction = {
  type: typeof SET_SEARCH_QUERY;
  payload: string;
};

export type SetPageAction = {
  type: typeof SET_PAGE;
  payload: number;
};

export type SetPodcastStatus = {
  type: typeof SET_PODCAST_STATUS;
};

export type GetPodcastsFilterAction = {
  type: typeof GET_PODCASTS_FILTER;
  payload: IPodcastsFilter;
};

export type SetPodcastsFilterAction = {
  type: typeof SET_PODCASTS_FILTER;
  payload: {
    value: string | boolean;
    parentItem: INestedSelectItem;
  };
};

export type ResetPodcastsFilterAction = {
  type: typeof RESET_PODCASTS_FILTER;
};

export type ResetPageAction = {
  type: typeof RESET_PAGE;
};

export type PodcastActions =
  | GetPodcastsByPodcasterAction
  | SetSearchQueryAction
  | SetPageAction
  | SetPodcastStatus
  | GetPodcastsFilterAction
  | SetPodcastsFilterAction
  | ResetPodcastsFilterAction
  | ResetPageAction;

export type PodcastDispatch = ThunkDispatch<
  IPodcastState,
  void,
  PodcastActions
>;
