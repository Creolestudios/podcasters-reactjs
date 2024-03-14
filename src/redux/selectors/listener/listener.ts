import { createSelector } from 'reselect';
import { IState } from '../../types';
import { IPodcastSearchState } from '../../types/listener';

export const getSearchedPodcast = (state: IState) => state.listener.searchPodcast;
export const getSearchQuery = createSelector(
  getSearchedPodcast,
  (searchPodcast: IPodcastSearchState) => searchPodcast?.search,
);
export const getCurrentPage = createSelector(
  getSearchedPodcast,
  (searchPodcast: IPodcastSearchState) => searchPodcast?.page,
);
export const getPageSize = createSelector(
  getSearchedPodcast,
  (searchPodcast: IPodcastSearchState) => searchPodcast?.size,
);
