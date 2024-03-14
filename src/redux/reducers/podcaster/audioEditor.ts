import { autoGenerateAudioName, getSplicedItems } from '../../../utils';
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
import {
  AudioControl,
  AudioEditorActions,
  AudioPlay,
} from '../../types/audioEditor';

const initialPlayAudioTrack: AudioPlay = {
  isPlay: false,
  index: null,
};

const initialAudioControl: AudioControl = {
  isMute: false,
  volumeLabel: 0.5,
  id: '',
  name: '',
  isRename: false,
  isLocked: false,
  speed: 1,
  isSpeedOpen: false,
  volumeLabelBeforeMute: 0.5,
  startPosition: 0,
  startTime: 0,
};

const initialState: any = {
  data: [],
  durationList: [],
  playAudioTrack: initialPlayAudioTrack,
  audioControls: [],
  renameAudio: null,
  episodeList: [],
  musicList: [],
  episodeId: '',
  recentlyUsedMusicList: [],
  deletedTracks: [],
  history: {},
};

// eslint-disable-next-line
const audioEditor = (state = initialState, action: AudioEditorActions) => {
  switch (action.type) {
    case GET_AUDIO_TRACKS:
      return {
        ...state,
        data: action.payload.tracks,
        durationList: action.payload.tracks.map((item: any) => Number(item.duration.toFixed(2))),
        audioControls: action.payload.tracks.map(
          (item: any, index: number) => ({
            ...initialAudioControl,
            id: item.uuid,
            name: item.name,
            isLocked: item.locked,
            volumeLabel: item.volume / 10,
            speed: item.speed < 0.25 || item.speed > 2.0 ? 1 : item.speed,
            startPosition: item.startPosition,
            startTime: item.startTime,
          }),
        ),
        episodeId: action.payload.episodeId,
      };

    case SET_DURATION:
      return {
        ...state,
        durationList: [...state.durationList, action.payload],
      };

    case SET_PLAY_AUDIO_TRACK:
      return {
        ...state,
        playAudioTrack: action.payload,
      };

    case DUPLICATE_AUDIO_TRACK:
      return {
        ...state,
        data: [
          ...getSplicedItems(state.data, action.payload + 1, 0, {
            ...state.data[action.payload],
            name: autoGenerateAudioName(
              state.data[action.payload].name,
              state.data,
            ),
          }),
        ],
        durationList: [
          ...getSplicedItems(
            state.durationList,
            action.payload + 1,
            0,
            state.durationList[action.payload],
          ),
        ],
        audioControls: [
          ...getSplicedItems(
            state.audioControls,
            action.payload + 1,
            0,
            state.audioControls[action.payload],
          ),
        ],
      };

    case SPLIT_AUDIO:
      return {
        ...state,
        history: {
          index: action.payload.index + 1,
          trackData: action.payload.dataElement,
          duration: action.payload.dataElement.duration,
          audioControls: {
            ...initialAudioControl,
            name: action.payload.dataElement.name,
            id: state.data.length + 1,
            isLocked: false,
          },
          actionName: SPLIT_AUDIO,
        },
        data: [
          ...getSplicedItems(
            state.data,
            action.payload.index + 1,
            0,
            action.payload.dataElement,
          ),
        ],
        durationList: [
          ...getSplicedItems(
            state.durationList,
            action.payload.index + 1,
            0,
            action.payload.dataElement.duration,
          ),
        ],
        audioControls: [
          ...getSplicedItems(state.audioControls, action.payload.index + 1, 0, {
            ...initialAudioControl,
            name: action.payload.dataElement.name,
            id: state.data.length + 1,
            isLocked: false,
          }),
        ],
      };

    case MUTE_AUDIO:
      return {
        ...state,
        audioControls: [
          ...getSplicedItems(state.audioControls, action.payload, 1, {
            ...state.audioControls[action.payload],
            volumeLabelBeforeMute:
              state.audioControls[action.payload].volumeLabel,
            volumeLabel: 0,
            isMute: true,
          }),
        ],
      };

    case UNMUTE_AUDIO:
      return {
        ...state,
        audioControls: [
          ...getSplicedItems(state.audioControls, action.payload, 1, {
            ...state.audioControls[action.payload],
            volumeLabel:
              state.audioControls[action.payload].volumeLabelBeforeMute,
            isMute: false,
          }),
        ],
      };

    case SET_VOLUME_LABEL:
      return {
        ...state,
        audioControls: [
          ...getSplicedItems(state.audioControls, action.payload.index, 1, {
            ...state.audioControls[action.payload.index],
            volumeLabel: action.payload.value,
          }),
        ],
      };

    case SET_RENAME_AUDIO:
      return {
        ...state,
        audioControls: state.audioControls.map(
          (item: AudioControl, index: number) => {
            const _index = action.payload.index;
            const { name } = action.payload;

            return index === _index && name === item.name
              ? { ...item, isRename: true }
              : item;
          },
        ),
        renameAudio: action.payload.index,
      };

    case RESET_RENAME_AUDIO:
      return {
        ...state,
        audioControls: state.audioControls.map(
          (item: AudioControl, index: number) => {
            const _index = action.payload.index;
            const { name } = action.payload;

            return index === _index && name === item.name
              ? { ...item, isRename: false }
              : item;
          },
        ),
        renameAudio: null,
      };

    case UPDATE_AUDIO_NAME:
      return {
        ...state,
        audioControls: [
          ...getSplicedItems(state.audioControls, action.payload.index, 1, {
            ...state.audioControls[action.payload.index],
            name: action.payload.name,
            isRename: false,
          }),
        ],
        renameAudio: null,
        data: [
          ...getSplicedItems(state.data, action.payload.index, 1, {
            ...state.data[action.payload.index],
            name: action.payload.name,
          }),
        ],
      };

    case LOCK_AUDIO_TRACK:
      return {
        ...state,
        audioControls: [
          ...getSplicedItems(state.audioControls, action.payload.index, 1, {
            ...state.audioControls[action.payload.index],
            isLocked: action.payload.value,
          }),
        ],
      };

    case ADD_AUDIO_TRACK:
      return {
        ...state,
        data: [...state.data, action.payload],
        durationList: [
          ...state.durationList,
          Number(action.payload.duration.toFixed(2)),
        ],
        audioControls: [
          ...state.audioControls,
          {
            ...initialAudioControl,
            name: action.payload.name,
            id: action.payload.id,
          },
        ],
      };

    case GET_EPISODE_LIST:
      return {
        ...state,
        episodeList: action.payload,
      };

    case SET_AUDIO_SPEED:
      return {
        ...state,
        audioControls: [
          ...getSplicedItems(state.audioControls, action.payload.index, 1, {
            ...state.audioControls[action.payload.index],
            speed: action.payload.value,
          }),
        ],
      };

    case OPEN_AUDIO_SPEED:
      return {
        ...state,
        audioControls: [
          ...getSplicedItems(state.audioControls, action.payload.index, 1, {
            ...state.audioControls[action.payload.index],
            isSpeedOpen: action.payload.value,
          }),
        ],
      };

    case GET_MUSIC_LIST:
      return {
        ...state,
        musicList: action.payload.allMusic,
        recentlyUsedMusicList: action.payload.recentlyUsedMusic,
      };

    case ADD_MUSIC_TRACK:
      return {
        ...state,
        data: [
          ...state.data,
          {
            musicUuid: action.payload.uuid,
            name: action.payload.name,
            url: action.payload.url,
            duration: action.payload.duration,
            volume: 1,
            speed: 1,
            fileSize: 0,
            startPosition: 0,
            locked: false,
            type: 'music',
          },
        ],
        durationList: [...state.durationList, action.payload.duration],
        audioControls: [
          ...state.audioControls,
          {
            ...initialAudioControl,
            id: action.payload.uuid,
            name: action.payload.name,
          },
        ],
      };

    case DELETE_AUDIO_TRACK:
      return {
        ...state,
        history: {
          index: action.payload,
          audioControls: state.audioControls[action.payload],
          trackData: state.data[action.payload],
          duration: state.durationList[action.payload],
          actionName: DELETE_AUDIO_TRACK,
        },
        data: state.data.filter(
          (item: any, index: number) => index !== action.payload,
        ),
        durationList: state.durationList.filter(
          (duration: number, index: number) => index !== action.payload,
        ),
        audioControls: state.audioControls.filter(
          (item: AudioControl, index: number) => index !== action.payload,
        ),
        deletedTracks: Object.keys(state.data[action.payload]).includes('uuid')
          ? [...state.deletedTracks, state.data[action.payload].uuid]
          : [...state.deletedTracks],
      };

    case UNDO_AUDIO_TRACK:
      return {
        ...state,
        data:
          state.history.actionName === DELETE_AUDIO_TRACK
            ? [
              ...getSplicedItems(
                state.data,
                state.history.index,
                0,
                state.history.trackData,
              ),
            ]
            : [...getSplicedItems(state.data, state.history.index, 1, null)],
        audioControls:
          state.history.actionName === DELETE_AUDIO_TRACK
            ? [
              ...getSplicedItems(
                state.audioControls,
                state.history.index,
                0,
                state.history.audioControls,
              ),
            ]
            : [
              ...getSplicedItems(
                state.audioControls,
                state.history.index,
                1,
                null,
              ),
            ],
        durationList:
          state.history.actionName === DELETE_AUDIO_TRACK
            ? [
              ...getSplicedItems(
                state.durationList,
                state.history.index,
                0,
                state.history.duration,
              ),
            ]
            : [
              ...getSplicedItems(
                state.durationList,
                state.history.index,
                1,
                null,
              ),
            ],
        history: {},
      };

    case DRAG_AUDIO_TRACK:
      return {
        ...state,
        audioControls: [
          ...getSplicedItems(state.audioControls, action.payload.index, 1, {
            ...state.audioControls[action.payload.index],
            startPosition: action.payload.position,
            startTime: action.payload.startTime,
          }),
        ],
      };

    case RESET_AUDIO_EDITOR:
      return {
        ...state,
        ...initialState,
      };

    case RESET_AUDIO_SPEED_TRAY:
      return {
        ...state,
        audioControls: state.audioControls.map((item: any) => ({
          ...item,
          isSpeedOpen: false,
        })),
      };

    default:
      return state;
  }
};

export default audioEditor;
