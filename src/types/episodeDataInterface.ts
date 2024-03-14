import { ITag } from '../components/form/TagWrapper';

export interface episodeDataInterface {
  audioFile?: string;
  file?: File | null;
  description?: string;
  id?: number | string;
  duration?: number | any;
  episodeNo?: number | null;
  podcastId?: number;
  name?: string;
  tagNames: string[];
  publishStatus?: string;
  processedAudioFile?: string;
  recorderAudioFile?: string;
  uuid?: string;
  categoryId?: number;
  podcastTypeId?: number;
  episodeTagNames?: string[];
}

export interface updateEpisodeDataInterface {
  audioFile?: string;
  file?: File | null;
  description?: string;
  id?: number | string;
  duration?: number | any;
  episodeNo?: number | null;
  podcastId?: number;
  name?: string;
  tagNames?: string[];
  publishStatus?: string;
  processedAudioFile?: string;
  recorderAudioFile?: string;
  uuid?: string;
  categoryId?: number;
  podcastTypeId?: number;
  episodeTagNames?: string[];
}

export interface EpisodeDetailByIdInterface extends episodeDataInterface {
  coverImage: File | null; // need to check this
  episodeUrl: File | null;
  tags: string[];
}

export interface uploadThumbnailImageInterface {
  file: File | string | null;
  id: string;
}

export interface IEpisodeForm {
  thumbnail: File | Blob | null | string;
  cover: File | Blob | null | string;
  episodeNo: number | null;
  episodeTitle: string;
  description: string;
  tags: ITag[] | [];
  episodeCountry: string;
  date: string;
  time: string;
  status: string;
  uploadedAudio: any;
  enhancedAudio: null | File | Blob | string;
  blobUrl: null | string | Blob | string;
  recordedAudio: null | File | Blob | string;
  processedAudio: null | File | Blob | string;
  sentimentNames: string[] | [];
  transcriptStatus?: string;
  transcriptUuid: string;
}

export interface IEpisode {
  name: string;
  description: string;
  duration: number;
  episodeNo: number | null;
  publishStatus: string;
  recorderAudioFile: string;
  processedAudioFile: string;
  scheduledDate: string | number;
  sentimentNames: string[] | [];
  tagNames: string[] | [];
  audioFile: string;
  podcastUuid: string;
  episodeCountry: string;
  transcriptUuid: string;
}
