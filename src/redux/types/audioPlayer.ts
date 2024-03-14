import { ThunkDispatch } from 'redux-thunk';

import {
  SET_AUDIO_PLAYER,
  CLOSE_AUDIO_PLAYER,
  NEXT_AUDIO,
  PREVIOUS_AUDIO,
  PLAY_AUDIO_TRACK,
  PAUSE_AUDIO_TRACK,
} from '../constants/audioPlayer';

import { IAudioEpisode, IAudioPlayer } from '../../types';

export type SetAudioPlayerAction = {
  type: typeof SET_AUDIO_PLAYER;
  payload: {
    episodes: IAudioEpisode[];
    activeEpisodeId: string | null;
    isOpen: boolean;
  };
};

export type CloseAudioPlayerAction = {
  type: typeof CLOSE_AUDIO_PLAYER;
};

export type NextAudioAction = {
  type: typeof NEXT_AUDIO;
};

export type PrevAudioAction = {
  type: typeof PREVIOUS_AUDIO;
};

export type PlayAudioTrackAction = {
  type: typeof PLAY_AUDIO_TRACK;
};

export type PauseAudioTrackAction = {
  type: typeof PAUSE_AUDIO_TRACK;
};

export type AudioPlayerActions =
  | SetAudioPlayerAction
  | CloseAudioPlayerAction
  | NextAudioAction
  | PrevAudioAction
  | PlayAudioTrackAction
  | PauseAudioTrackAction;

export type AudioPlayerDispatch = ThunkDispatch<
  IAudioPlayer,
  void,
  AudioPlayerActions
>;
