import {
  SET_AUDIO_PLAYER,
  CLOSE_AUDIO_PLAYER,
  NEXT_AUDIO,
  PREVIOUS_AUDIO,
  PLAY_AUDIO_TRACK,
  PAUSE_AUDIO_TRACK,
} from '../constants/audioPlayer';
import { IAudioPlayer } from '../../types';
import { AudioPlayerActions } from '../types/audioPlayer';
import { getNextAudio, getPrevAudio } from '../utils/indes';

const initialState: IAudioPlayer = {
  episodes: [],
  activeEpisodeId: '',
  isOpen: false,
  isPlayTrack: false,
};

// eslint-disable-next-line
const audioPlayer = (state = initialState, action: AudioPlayerActions) => {
  switch (action.type) {
    case SET_AUDIO_PLAYER:
      return {
        ...state,
        episodes: action.payload.episodes,
        activeEpisodeId: action.payload.activeEpisodeId,
        isOpen: action.payload.isOpen,
      };

    case CLOSE_AUDIO_PLAYER:
      return {
        ...state,
        isOpen: false,
        isPlayTrack: false,
      };
    case NEXT_AUDIO:
      return {
        ...state,
        activeEpisodeId: getNextAudio(state.episodes, state.activeEpisodeId),
      };

    case PREVIOUS_AUDIO:
      return {
        ...state,
        activeEpisodeId: getPrevAudio(state.episodes, state.activeEpisodeId),
      };

    case PLAY_AUDIO_TRACK:
      return {
        ...state,
        isPlayTrack: true,
      };

    case PAUSE_AUDIO_TRACK:
      return {
        ...state,
        isPlayTrack: false,
      };

    default:
      return state;
  }
};

export default audioPlayer;
