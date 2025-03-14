import * as actionType from '../constants/actionTypes';

// Define a proper initial state with all possible properties
const initialState = { 
  authData: null, 
  loading: false, 
  errors: null 
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.AUTH:
      // Remove side effects from reducer - localStorage should be handled in action creators
      return { ...state, authData: action.data, loading: false, errors: null };
    case actionType.LOGOUT:
      // Remove side effects from reducer
      return { ...state, authData: null, loading: false, errors: null };
    default:
      return state;
  }
};

export default authReducer;
