import { FETCH_PROFILE, UPDATE_PROFILE, UPDATE_PROFILE_PICTURE } from '../constants/actionTypes';

const initialState = { 
  profile: null, 
  loading: false, 
  error: null 
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, loading: true };
    case 'END_LOADING':
      return { ...state, loading: false };
    case FETCH_PROFILE:
    case UPDATE_PROFILE:
    case UPDATE_PROFILE_PICTURE:
      return { ...state, profile: action.payload, loading: false };
    case 'PROFILE_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default profileReducer;
