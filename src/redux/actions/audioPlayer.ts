import { IAudioEpisode } from '../../types';
import {
  CLOSE_AUDIO_PLAYER,
  NEXT_AUDIO,
  PAUSE_AUDIO_TRACK,
  PLAY_AUDIO_TRACK,
  PREVIOUS_AUDIO,
  SET_AUDIO_PLAYER,
} from '../constants/audioPlayer';

import { AudioPlayerDispatch } from '../types/audioPlayer';

// Set audio player
export function setAudioPlayerAction(
  episodes: IAudioEpisode[],
  activeEpisodeId: string,
  isOpen: boolean,
) {
  return async (dispatch: AudioPlayerDispatch) => dispatch({
    type: SET_AUDIO_PLAYER,
    payload: { episodes, activeEpisodeId, isOpen },
  });
}

// Close audio player
export function closeAudioPlayerAction() {
  return async (dispatch: AudioPlayerDispatch) => dispatch({
    type: CLOSE_AUDIO_PLAYER,
  });
}

// Next audio
export function nextAudioAction() {
  return async (dispatch: AudioPlayerDispatch) => dispatch({
    type: NEXT_AUDIO,
  });
}

// Next audio
export function prevAudioAction() {
  return async (dispatch: AudioPlayerDispatch) => dispatch({
    type: PREVIOUS_AUDIO,
  });
}

// Play track
export function playAudioTrackAction() {
  return async (dispatch: AudioPlayerDispatch) => dispatch({
    type: PLAY_AUDIO_TRACK,
  });
}

// Pause track
export function pauseAudioTrackAction() {
  return async (dispatch: AudioPlayerDispatch) => dispatch({
    type: PAUSE_AUDIO_TRACK,
  });
}
