import { Dispatch, SetStateAction } from 'react';
import { IUser } from '.';

export interface audioEnhanceInterface {
  setUploadedFile: (val: string) => void;
  setStage: (val: number) => void;
  enhancedAudio: File | string;
  setEnhancedAudio: Dispatch<SetStateAction<File | string>>;
  downloadPath?: string;
  sentiments: string[];
  setSentiments: Dispatch<SetStateAction<string[]>>;
  formInstance?: any;
  handleClick?: (value: any, isOpenEditor: boolean) => void;
  user?: IUser;
}

export interface BeforeAfterRecordingInterface {
  setStage: (val: number) => void;
  audioType: 'recorded' | 'uploaded' | '';
  enhancedAudio: string | File;
  uploadedFile: string;
  sentiments: string[];
  setSentiments: Dispatch<SetStateAction<string[]>>;
  setEnhancedAudio: Dispatch<SetStateAction<File | string>>;
  handleAudioChange: (e: File, isEnhanced?: boolean) => void;
  isUploading: boolean;
  uploadProcess: number;
}
