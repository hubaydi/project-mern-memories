const profileReducer = (state = { profile: null }, action) => {
  switch (action.type) {
    case 'FETCH_PROFILE':
      return { ...state, profile: action.payload };
    case 'UPDATE_PROFILE':
      return { ...state, profile: action.payload };
    case 'UPDATE_PROFILE_PICTURE':
      return { ...state, profile: action.payload };
    default:
      return state;
  }
};

export default profileReducer;
