export interface Category {
  uuid: string;
  name: string;
  priority: number;
}
export interface PodcastType {
  uuid: string;
  name: string;
  priority: number;
}
export interface IAuthor {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotoUrl: string | null;
  bio: string | null;
  averageRating: number | null;
  podcastCount: number | null;
  episodeCount: number | null;
  allMonetizedAllPodcast: boolean;
}

export interface IEpisodeTag {
  uuid: string;
  tagName: string;
}

export interface IPodcastTag {
  uuid: string;
  tagName: string;
}

export interface IEpisodeLikeViewCount {
  likeCount: number | null;
  viewCount: number | null;
}

export interface IEpisode {
  uuid: string | null;
  name: string;
  description: string;
  duration: number | null;
  episodeNo: number | null;
  episodeUrl: string;
  episodeCoverImage: string;
  episodeThumbnailImage: string;
  episodeStatus: string;
  podcastId: number | null;
  country: string;
  language: string;
  categoryName: string;
  episodeTags: [IEpisodeTag];
  episodePublishedOrScheduleDate: number | null;
  sentiments: Array<any>;
  episodeLikeViewCount: IEpisodeLikeViewCount;
  likedEpisode?: boolean;
}
export interface IPodcast {
  uuid: string | null;
  name: string;
  description: string;
  podcastCoverImage: string;
  category: Category;
  podcastStatus: string;
  publishedDate: number | null;
  podcastType: PodcastType;
  podcastCountry: string;
  podcastLanguage: string;
  user: IAuthor;
  episodes: [IEpisode];
  podcastTags: [IPodcastTag];
  podcastThumbnailImage: string;
  slugUrl: string;
  authorUuid: string | null;
  averageRating: number | null;
  numberOfViews: number | null;
  monetized: boolean;
  totalEpisodes: number;
}

export interface IPodcastAnalytics {
  uuid: string | null;
  podcastId: number | null;
  userId: string | null;
  favorite: boolean;
  subscribed: boolean;
}

export interface IPodcastAuthor {
  country: string;
  authorUuid: string;
  rating: number;
  authorProfilePhotoUrl: string | null;
  authorBio: string;
  avgAuthorRating: number;
  subscribe: boolean;
  authorFirstName: string;
  authorLastName: string;
}

export interface IPodcastDetails {
  podcast: IPodcast;
  podcastAnalytics: IPodcastAnalytics;
  podcastAuthor: IPodcastAuthor;
  podcastRating: number | null;
}

export interface IEpisodeAnalytics {
  uuid: string;
  episodeId: number;
  userId: number;
  download: boolean;
  duration: number | null;
}

export interface IEpisodeDetails {
  commentList: Array<any>;
  episode: IEpisode;
  episodeAnalytics: IEpisodeAnalytics;
  episodeLikeViewCount: IEpisodeLikeViewCount;
  nextEpisodeList: IEpisode;
  totalComments: number;
  transcript: any;
}

export interface IPodcastHistory {
  coverImage: string;
  description: string;
  name: string;
  podcastStatus: string;
  publishedDate: string;
  slugUrl: string;
  thumbnailImage: string;
  user: any;
  uuid: string;
}

export interface ISubscribedPodcaster {
  averageRating: number;
  bio: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string;
  uuid: string;
}

export interface IDownloadEpisode {
  uuid: string | null;
  name: string;
  description: string;
  duration: number | null;
  episodeNo: number | null;
  episodeUrl: string;
  episodeCoverImage: string;
  episodeThumbnailImage: string;
  episodeStatus: string;
  country: string;
  language: string;
  categoryName: string;
  playedDuration: number;
  episodeTags: [IEpisodeTag];
  episodePublishedOrScheduleDate: number | null;
  podcastId: number | null;
  sentiments: Array<string>;
  episodeLikeViewCount: IEpisodeLikeViewCount;
  likedEpisode: boolean;
}
