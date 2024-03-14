import {
  IPodcast,
  IEpisode,
  IPodcastTag,
  Category,
  PodcastType,
  IAuthor,
  IEpisodeLikeViewCount,
} from '../types/listener';

export const INITIAL_TAG: IPodcastTag = {
  tagName: '',
  uuid: '',
};
export const INITIAL_CATEGORY: Category = {
  uuid: '',
  name: '',
  priority: 0,
};
export const INITIAL_PODCAST_TYPE: PodcastType = {
  uuid: '',
  name: '',
  priority: 0,
};
export const INTIAL_AUTHOR_DETAILS: IAuthor = {
  uuid: '',
  firstName: '',
  lastName: '',
  email: '',
  profilePhotoUrl: null,
  bio: '',
  averageRating: null,
  podcastCount: null,
  episodeCount: null,
  allMonetizedAllPodcast: false,
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
  episodeTags: [
    {
      uuid: '',
      tagName: '',
    },
  ],
  sentiments: [],
  episodeStatus: '',
  episodeLikeViewCount: INITIAL_EPISODE_LIKE_VIEW,
  episodePublishedOrScheduleDate: null,
};
export const INITIAL_PODCAST_DETAIL: IPodcast = {
  uuid: null,
  name: '',
  description: '',
  podcastCoverImage: '',
  category: INITIAL_CATEGORY,
  podcastStatus: '',
  publishedDate: null,
  podcastType: INITIAL_PODCAST_TYPE,
  podcastCountry: '',
  podcastLanguage: '',
  user: INTIAL_AUTHOR_DETAILS,
  episodes: [INITIAL_EPISODE],
  podcastTags: [INITIAL_TAG],
  podcastThumbnailImage: '',
  slugUrl: '',
  authorUuid: null,
  averageRating: null,
  numberOfViews: null,
  monetized: false,
  totalEpisodes: 0,
};
