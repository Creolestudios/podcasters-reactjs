import { createSelector } from 'reselect';

import { IState } from '../../types';
import { IPodcastState } from '../../types/podcast';

export const getPodcast = (state: IState) => state.podcaster.podcast;

export const getPodcasts = createSelector(
  getPodcast,
  (podcast: IPodcastState) => podcast.podcasts,
);
export const getCurrentPage = createSelector(
  getPodcast,
  (podcast: IPodcastState) => podcast.page,
);
export const getPageSize = createSelector(
  getPodcast,
  (podcast: IPodcastState) => podcast.size,
);
export const getSearchQuery = createSelector(
  getPodcast,
  (podcast: IPodcastState) => podcast.search,
);
export const getTotalPodcasts = createSelector(
  getPodcast,
  (podcast: IPodcastState) => podcast.total,
);
export const getColumnId = createSelector(
  getPodcast,
  (podcast: IPodcastState) => podcast.sortColumnId,
);
export const getColumnDirection = createSelector(
  getPodcast,
  (podcast: IPodcastState) => podcast.sortDirection,
);
export const hasPodcasts = createSelector(
  getPodcast,
  (podcast: IPodcastState) => podcast.hasPodcasts,
);

export const getPodcastsFilter = createSelector(
  getPodcast,
  (podcast: IPodcastState) => podcast.filter,
);

export const getPodcastsFilterParams = createSelector(
  getPodcast,
  (podcast: IPodcastState) => podcast.filterParams,
);
