import { combineReducers } from 'redux';

import podcast from './podcast';
import audioEditor from './audioEditor';

const podcasterRootReducer = combineReducers({
  podcast,
  audioEditor,
});

export default podcasterRootReducer;
