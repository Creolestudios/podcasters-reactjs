import { IEpisodeForm } from '../types/episodeDataInterface';
import { IPodcastForm } from '../types/podcastInterface';
import {
  IEpisode,
  IEpisodeLikeViewCount,
  IPodcastDetail,
  IPodcastDetailUser,
  IPodcastsFilterItem,
} from '../types/podcaster';

export const INITIAL_PODCAST_ITEM: IPodcastsFilterItem = {
  uuid: null,
  name: '',
  priority: null,
};

export const INITIAL_PODCAST_DETAIL_USER: IPodcastDetailUser = {
  averageRating: null,
  bio: '',
  email: '',
  episodeCount: null,
  firstName: '',
  lastName: '',
  podcastCount: null,
  uuid: null,
  profilePhotUrl: null,
  allMonetizedAllPodcast: false,
};

export const INITIAL_TAG = {
  tagName: '',
  uuid: null,
};

export const INITIAL_EPISODE_LIKE_VIEW: IEpisodeLikeViewCount = {
  likeCount: null,
  viewCount: null,
};

export const INITIAL_EPISODE: IEpisode = {
  uuid: null,
  name: '',
  description: '',
  duration: null,
  episodeNo: null,
  episodeUrl: '',
  episodeCoverImage: '',
  episodeThumbnailImage: '',
  podcastId: null,
  country: '',
  language: '',
  categoryName: '',
  episodeTags: [],
  episodeStatus: '',
  sentiments: [],
  episodeLikeViewCount: INITIAL_EPISODE_LIKE_VIEW,
  episodePublishedDate: '',
};

export const INITIAL_PODCAST_DETAIL: IPodcastDetail = {
  uuid: null,
  name: '',
  description: '',
  podcastCoverImage: '',
  category: INITIAL_PODCAST_ITEM,
  podcastStatus: '',
  publishedDate: null,
  podcastType: INITIAL_PODCAST_ITEM,
  podcastCountry: '',
  podcastLanguage: '',
  user: INITIAL_PODCAST_DETAIL_USER,
  episodes: [],
  podcastTags: [],
  podcastThumbnailImage: '',
  slugUrl: '',
  authorUuid: null,
  averageRating: null,
  numberOfViews: null,
  monetized: false,
  totalEpisodes: 0,
};

export const INITIAL_ADD_EPISODE: IEpisodeForm = {
  thumbnail: null,
  cover: null,
  episodeNo: 0,
  episodeTitle: '',
  description: '',
  tags: [],
  episodeCountry: '',
  date: '',
  time: '',
  status: '',
  uploadedAudio: null,
  enhancedAudio: null,
  blobUrl: null,
  recordedAudio: null,
  processedAudio: null,
  sentimentNames: [],
  transcriptStatus: '',
  transcriptUuid: '',
};

export const INITIAL_PODCAST: IPodcastForm = {
  thumbnail: null,
  cover: null,
  podcastCategory: '',
  podcastType: '',
  podcastTitle: '',
  description: '',
  country: '',
  language: '',
  slugUrl: '',
  tags: [],
  status: '',
  uploadedAudio: '',
  enhancedAudio: null,
  sentimentNames: [],
  date: '',
  time: '',
  monetized: false,
  warnListeners: false,
  featured: false,
  upgradePlanForFeatured: true,
  transcriptUuid: '',
};
