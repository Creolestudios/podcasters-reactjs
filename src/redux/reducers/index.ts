import { combineReducers } from 'redux';

import user from './user';
import podcasterRootReducer from './podcaster';
import audioPlayer from './audioPlayer';
import listenerRootReducer from './listener';

const rootReducer = combineReducers({
  user,
  podcaster: podcasterRootReducer,
  audioPlayer,
  listener: listenerRootReducer,
});

export default rootReducer;
