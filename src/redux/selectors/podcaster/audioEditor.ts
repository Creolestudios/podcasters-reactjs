import { createSelector } from 'reselect';

import { IState } from '../../types';
import { IAudioEditor } from '../../../types';

export const getAudioEditor = (state: IState) => state.podcaster.audioEditor;

export const getAudioData = createSelector(
  getAudioEditor,
  (editor: IAudioEditor) => editor.data,
);

export const getDurationList = createSelector(
  getAudioEditor,
  (editor: IAudioEditor) => editor.durationList,
);

export const getAudioPlayTrack = createSelector(
  getAudioEditor,
  (editor: IAudioEditor) => editor.playAudioTrack,
);

export const getAudioControls = createSelector(
  getAudioEditor,
  (editor: IAudioEditor) => editor.audioControls,
);

export const getRenameAudio = createSelector(
  getAudioEditor,
  (editor: IAudioEditor) => editor.renameAudio,
);

export const getEpisodeList = createSelector(
  getAudioEditor,
  (editor: IAudioEditor) => editor.episodeList,
);

export const getMusicList = createSelector(
  getAudioEditor,
  (editor: IAudioEditor) => editor.musicList,
);

export const getEpisodeId = createSelector(
  getAudioEditor,
  (editor: IAudioEditor) => editor.episodeId,
);

export const getRecentlyUsedMusicList = createSelector(
  getAudioEditor,
  (editor: IAudioEditor) => editor.recentlyUsedMusicList,
);

export const getDeletedTracks = createSelector(
  getAudioEditor,
  (editor: IAudioEditor) => editor.deletedTracks,
);

export const getHistory = createSelector(
  getAudioEditor,
  (editor: IAudioEditor) => editor.history,
);
