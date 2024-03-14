import { combineReducers } from 'redux';

import homePageData from './listener';
import searchPodcast from './search';

const listenerRootReducer = combineReducers({
  homePageData,
  searchPodcast,
});

export default listenerRootReducer;
