import { ITag } from '../components/form/TagWrapper';

export interface IPodcastDetails {
  categoryUuid: string;
  podcastTypeUuid: string;
  name: string;
  description: string;
  podcastCountry: string;
  podcastLanguage: string;
  tagNames: string[];
  episodeTagNames: string[];
  episodeSentiments?: string[];
  podcastStatus: string;
  podcastDuration: number;
  recorderAudioFile: string;
  processedAudioFile: string;
  audioFile: string;
  slugUrl: string;
  scheduledDate?: string;
  monetized: boolean;
  warnListeners: boolean;
}

export interface IPresignedUrl {
  extensionRecordedFile: string;
  extensionProcessedFile: string;
}

export interface PodcastType {
  uuid: string;
  // id: number;
  name: string;
  priority: number;
}

export interface Category {
  uuid: string;
  // id: number;
  name: string;
  priority: number;
}

export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  invitationStatus: string;
  invitationAcceptedDate: string;
  profilePhotoUrl: string;
  userStatus: string;
  bio: string;
}

export interface Tag {
  uuid: string;
  id: number;
  tagName: string;
}

export interface PodcastItemsInterface {
  uuid: string;
  id: number;
  name: string;
  description: string;
  coverImage: string;
  thumbnailImage?: string;
  category: Category;
  podcastStatus: string;
  publishedDate: string;
  podcastType: PodcastType;
  podcastCountry: string;
  podcastLanguage: string;
  user: User;
  episodeCount: number;
  tags: Tag[];
  slugUrl: string;
  monetized: boolean;
  warnListeners: boolean;
}

export interface AddPodcastInterface {
  audioFile: string;
  categoryId: string;
  description: string;
  episodeTagNames: string[];
  name: string;
  podcastCountry: string;
  podcastDuration: number;
  podcastLanguage: string;
  podcastStatus: string;
  podcastTypeId: string;
  processedAudioFile: string;
  recorderAudioFile: string;
  tagNames: string[];
  trailer?: boolean;
  slugUrl?: string;
  coverImage?: string;
  thumbnailImage?: string;
}

export interface EditPodcastInterface {
  audioFile?: string;
  categoryUuid?: string;
  description?: string;
  episodeTagNames?: string[];
  name?: string;
  podcastCountry?: string;
  podcastDuration?: number;
  podcastLanguage?: string;
  podcastStatus?: string;
  podcastTypeUuid?: string;
  processedAudioFile?: string;
  recorderAudioFile?: string;
  tagNames?: string[];
  trailer?: boolean;
  slugUrl?: string;
  coverImage?: string;
  thumbnailImage?: string;
  monetized: boolean;
  warnListeners: boolean;
}

export interface SearchPodcastInterface {
  uuid: string;
  name: string;
  description: string;
  podcastStatus: string;
  publishedDate: number;
  user: {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePhotoUrl: string;
    bio: string;
    averageRating: string;
    podcastCount: string;
    episodeCount: string;
    allMonetizedAllPodcast: boolean;
  };
  podcastTags: [];
  slugUrl: string;
  averageRating: number;
  numberOfViews: number;
  monetized: boolean;
}

export interface IPodcastForm {
  thumbnail: File | Blob | null | string;
  cover: File | Blob | null | string;
  podcastCategory: string;
  podcastType: string;
  podcastTitle: string;
  description: string;
  country: string;
  language: string;
  slugUrl: string;
  tags: ITag[] | [];
  status: string;
  date: string;
  time: string;
  uploadedAudio: string;
  enhancedAudio: null | File | Blob | string;
  sentimentNames: string[] | [];
  monetized: boolean;
  warnListeners: boolean;
  featured?: boolean;
  upgradePlanForFeatured?: boolean;
  transcriptUuid:string;
}

export interface IPodcast {
  categoryUuid: string;
  podcastTypeUuid: string;
  name: string;
  description: string;
  podcastCountry: string;
  podcastLanguage: string;
  podcastStatus: string;
  tagNames: [] | string[];
  slugUrl: string;
  monetized: boolean;
  warnListeners: boolean;
  scheduledDate: number | string;
}

export interface IAddPodcast extends IPodcast {
  episodeTagNames: [];
  episodeSentiments: [] | string[];
}

export interface IPodcastUploaded {
  isPodcastUploaded: boolean;
  podcastId: string | null;
}
