import { ThunkDispatch } from 'redux-thunk';

import { IAudioEditor, IMusicItem } from '../../types';
import { IState } from '.';
import {
  GET_AUDIO_TRACKS,
  SET_DURATION,
  SET_PLAY_AUDIO_TRACK,
  DUPLICATE_AUDIO_TRACK,
  SPLIT_AUDIO,
  MUTE_AUDIO,
  UNMUTE_AUDIO,
  SET_VOLUME_LABEL,
  SET_RENAME_AUDIO,
  RESET_RENAME_AUDIO,
  UPDATE_AUDIO_NAME,
  LOCK_AUDIO_TRACK,
  ADD_AUDIO_TRACK,
  GET_EPISODE_LIST,
  SET_AUDIO_SPEED,
  OPEN_AUDIO_SPEED,
  GET_MUSIC_LIST,
  ADD_MUSIC_TRACK,
  DELETE_AUDIO_TRACK,
  UNDO_AUDIO_TRACK,
  DRAG_AUDIO_TRACK,
  RESET_AUDIO_EDITOR,
  RESET_AUDIO_SPEED_TRAY,
} from '../constants/podcaster/audioEditor';

export type AudioPlay = {
  isPlay: boolean;
  index: number | null;
};

export type AudioControl = {
  isMute: boolean;
  volumeLabel: number;
  name: string;
  id: string;
  isRename: boolean;
  isLocked: boolean;
  speed: number;
  isSpeedOpen: boolean;
  volumeLabelBeforeMute: number;
  startPosition: number;
  startTime: number;
};

export type GetAudioTracksAction = {
  type: typeof GET_AUDIO_TRACKS;
  payload: any;
};

export type SetDurationAction = {
  type: typeof SET_DURATION;
  payload: any;
};

export type SetPlayAudioTrack = {
  type: typeof SET_PLAY_AUDIO_TRACK;
  payload: AudioPlay;
};

export type DuplicateAudioTrackAction = {
  type: typeof DUPLICATE_AUDIO_TRACK;
  payload: number;
};

export type SplitAudioAction = {
  type: typeof SPLIT_AUDIO;
  payload: any;
};

export type MuteAudioAction = {
  type: typeof MUTE_AUDIO;
  payload: number;
};

export type UnmuteAudioAction = {
  type: typeof UNMUTE_AUDIO;
  payload: number;
};

export type SetVolumeLabelAction = {
  type: typeof SET_VOLUME_LABEL;
  payload: {
    index: number;
    value: number | string;
  };
};

export type SetRenameAudioAction = {
  type: typeof SET_RENAME_AUDIO;
  payload: {
    index: number;
    name: string;
  };
};

export type ResetRenameAudioAction = {
  type: typeof RESET_RENAME_AUDIO;
  payload: {
    index: number;
    name: string;
  };
};

export type UpdateAudioNameAction = {
  type: typeof UPDATE_AUDIO_NAME;
  payload: {
    index: number;
    name: string;
  };
};

export type LockAudioTrackAction = {
  type: typeof LOCK_AUDIO_TRACK;
  payload: {
    index: number;
    value: boolean;
  };
};

export type AddAudioTrackAction = {
  type: typeof ADD_AUDIO_TRACK;
  payload: any;
};

export type GetEditorEpisodeListAction = {
  type: typeof GET_EPISODE_LIST;
  payload: any;
};

export type SetAudioSpeedAction = {
  type: typeof SET_AUDIO_SPEED;
  payload: {
    index: number;
    value: number;
  };
};

export type OpenAudioSpeedAction = {
  type: typeof OPEN_AUDIO_SPEED;
  payload: {
    index: number;
    value: boolean;
  };
};

export type GetMusicListAction = {
  type: typeof GET_MUSIC_LIST;
  payload: {
    allMusic: IMusicItem[] | [];
    recentlyUsedMusic: IMusicItem[] | [];
  };
};

export type AddMusicTrackAction = {
  type: typeof ADD_MUSIC_TRACK;
  payload: IMusicItem;
};

export type DeleteAudioTrackAction = {
  type: typeof DELETE_AUDIO_TRACK;
  payload: number;
};

export type UndoAudioTrackAction = {
  type: typeof UNDO_AUDIO_TRACK;
};
export type DragAudioTrackAction = {
  type: typeof DRAG_AUDIO_TRACK;
  payload: {
    index: number;
    position: number;
    startTime: number;
  };
};

export type ResetAudioEditorAction = {
  type: typeof RESET_AUDIO_EDITOR;
};

export type ResetAudioSpeedTrayAction = {
  type: typeof RESET_AUDIO_SPEED_TRAY;
};

export type AudioEditorActions =
  | GetAudioTracksAction
  | SetDurationAction
  | SetPlayAudioTrack
  | DuplicateAudioTrackAction
  | SplitAudioAction
  | MuteAudioAction
  | UnmuteAudioAction
  | SetVolumeLabelAction
  | SetRenameAudioAction
  | ResetRenameAudioAction
  | UpdateAudioNameAction
  | LockAudioTrackAction
  | AddAudioTrackAction
  | GetEditorEpisodeListAction
  | SetAudioSpeedAction
  | OpenAudioSpeedAction
  | GetMusicListAction
  | AddMusicTrackAction
  | DeleteAudioTrackAction
  | UndoAudioTrackAction
  | DragAudioTrackAction
  | ResetAudioEditorAction
  | ResetAudioSpeedTrayAction;

export type AudioEditorDispatch = ThunkDispatch<
  IAudioEditor,
  void,
  AudioEditorActions
>;
