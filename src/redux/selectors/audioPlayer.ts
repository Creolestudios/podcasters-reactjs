import { createSelector } from 'reselect';
import { IState } from '../types';
import { IAudioPlayer, IAudioEpisode } from '../../types';

export const getAudioPlayer = (state: IState) => state.audioPlayer;

export const getActiveEpisode = createSelector(
  getAudioPlayer,
  (audioPlayer: IAudioPlayer) => audioPlayer.episodes.find(
    (episode: IAudioEpisode) => episode.uuid === audioPlayer.activeEpisodeId,
  ),
);

export const showAudioPlayer = createSelector(
  getAudioPlayer,
  (audioPlayer: IAudioPlayer) => audioPlayer.isOpen,
);

export const getTotalEpisodes = createSelector(
  getAudioPlayer,
  (audioPlayer: IAudioPlayer) => audioPlayer.episodes.length,
);

export const getTrackStatus = createSelector(
  getAudioPlayer,
  (audioPlayer: IAudioPlayer) => audioPlayer.isPlayTrack,
);
