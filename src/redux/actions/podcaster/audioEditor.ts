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
} from '../../constants/podcaster/audioEditor';
import { AudioEditorDispatch, AudioPlay } from '../../types/audioEditor';
import { showToastMessage } from '../../../utils';
import { TOASTER_STATUS } from '../../../constant';
import {
  getAudiosByEpisodeId,
  getEpisodeList,
  getAllMusic,
} from '../../../services/podcaster/AudioEditor';
import { IMusicItem } from '../../../types';

export function getAudioTracks(id: string, isRequiredEpisodeList?: boolean) {
  return async (dispatch: AudioEditorDispatch) => {
    try {
      const response = await getAudiosByEpisodeId(id);

      if (response.data.success) {
        /* when landed on editor through open editor
          button has minor when it fix below code manage accordingly */

        // dispatch({
        //   type: GET_AUDIO_TRACKS,
        //   payload: {
        //     tracks: response.data.result,
        //     episodeId: id,
        //   },
        // });

        if (isRequiredEpisodeList) {
          // eslint-disable-next-line
          await dispatch(getEditorEpisodeList(true, id, response.data.result));
        } else {
          dispatch({
            type: GET_AUDIO_TRACKS,
            payload: {
              tracks: response.data.result,
              episodeId: id,
            },
          });
        }
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
      }
    } catch (error: any) {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        error?.response?.data?.result?.errorMessage ?? error.message,
      );
    }
  };
}

export function getDefaultMusicList() {
  return async (dispatch: AudioEditorDispatch) => {
    try {
      const response = await getAllMusic();

      if (response.data.success) {
        dispatch({
          type: GET_MUSIC_LIST,
          payload: {
            allMusic: response.data.result.allMusic,
            recentlyUsedMusic: response.data.result.recentlyUsedMusic,
          },
        });
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
      }
    } catch (error: any) {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        error?.response?.data?.result?.errorMessage ?? error.message,
      );
    }
  };
}

export function getEditorEpisodeList(
  isEditorPage: boolean,
  episodeId?: string,
  audioTracksData?: any,
) {
  return async (dispatch: AudioEditorDispatch) => {
    try {
      const response = await getEpisodeList();
      if (response.data.success && response.data.result.length > 0) {
        const episodeIds = response.data.result.map(
          (episode: any) => episode.uuid,
        );

        dispatch({
          type: GET_EPISODE_LIST,
          payload: response.data.result,
        });
        if (isEditorPage) {
          if (!episodeId) {
            await dispatch(getAudioTracks(episodeIds[0]));
          }

          if (episodeId && audioTracksData) {
            dispatch({
              type: GET_AUDIO_TRACKS,
              payload: {
                tracks: audioTracksData,
                episodeId,
              },
            });
          }
          await dispatch(getDefaultMusicList());
        }
      } else if (response.data.success && response.data.result.length === 0) {
        dispatch({
          type: GET_EPISODE_LIST,
          payload: response.data.result,
        });
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
      }
    } catch (error: any) {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        error?.response?.data?.result?.errorMessage ?? error.message,
      );
    }
  };
}

export function setDuration(value: any) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: SET_DURATION,
    payload: value,
  });
}

export function setPlayAudioTrack(value: AudioPlay) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: SET_PLAY_AUDIO_TRACK,
    payload: value,
  });
}

export function duplicateAudioTrack(value: number) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: DUPLICATE_AUDIO_TRACK,
    payload: value,
  });
}

export function splitAudio(value: any) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: SPLIT_AUDIO,
    payload: value,
  });
}

export function muteAudioTrack(index: number) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: MUTE_AUDIO,
    payload: index,
  });
}

export function unmuteAudioTrack(index: number) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: UNMUTE_AUDIO,
    payload: index,
  });
}

export function setVolumeLabel(index: number, value: string | number) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: SET_VOLUME_LABEL,
    payload: {
      index,
      value,
    },
  });
}

export function setRenameAudio(index: number, name: string) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: SET_RENAME_AUDIO,
    payload: {
      index,
      name,
    },
  });
}

export function resetRenameAudio(index: number, name: string) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: RESET_RENAME_AUDIO,
    payload: {
      index,
      name,
    },
  });
}

export function updateAudioName(index: number, name: string) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: UPDATE_AUDIO_NAME,
    payload: {
      index,
      name,
    },
  });
}

export function lockAudioTrack(index: number, value: boolean) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: LOCK_AUDIO_TRACK,
    payload: {
      index,
      value,
    },
  });
}

export function addAudioTrack(track: any) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: ADD_AUDIO_TRACK,
    payload: track,
  });
}

export function setAudioSpeed(index: number, value: number) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: SET_AUDIO_SPEED,
    payload: {
      index,
      value,
    },
  });
}

export function openAudioSpeed(index: number, value: boolean) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: OPEN_AUDIO_SPEED,
    payload: {
      index,
      value,
    },
  });
}

export function addMusicTrack(track: IMusicItem) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: ADD_MUSIC_TRACK,
    payload: track,
  });
}

export function deleteAudioTrack(index: number) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: DELETE_AUDIO_TRACK,
    payload: index,
  });
}

export function undoAudioTrack() {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: UNDO_AUDIO_TRACK,
  });
}
export function dragAudioTrack(
  index: number,
  position: number,
  startTime: number,
) {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: DRAG_AUDIO_TRACK,
    payload: {
      index,
      position,
      startTime,
    },
  });
}

export function resetAudioEditor() {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: RESET_AUDIO_EDITOR,
  });
}

export function resetAudioSpeedTray() {
  return async (dispatch: AudioEditorDispatch) => dispatch({
    type: RESET_AUDIO_SPEED_TRAY,
  });
}
