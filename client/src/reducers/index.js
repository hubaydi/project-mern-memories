import { combineReducers } from 'redux';

import posts from './posts';
import auth from './auth';
import profile from './profile';

export const reducers = combineReducers({ posts, auth, profile });
