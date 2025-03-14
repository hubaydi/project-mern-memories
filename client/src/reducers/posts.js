import { FETCH_ALL, FETCH_BY_SEARCH, FETCH_BY_CREATOR, FETCH_POST, CREATE, UPDATE, DELETE, LIKE, COMMENT } from '../constants/actionTypes';

// Define a proper initial state with all possible properties
const initialState = { 
  isLoading: false, 
  posts: [],
  post: null,
  error: null,
  currentPage: 1,
  numberOfPages: 1
};

// Use a named function for better debugging
function postsReducer(state = initialState, action) {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, isLoading: true };
    case 'END_LOADING':
      return { ...state, isLoading: false };
    case FETCH_ALL:
      return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
      };
    case FETCH_BY_SEARCH:
    case FETCH_BY_CREATOR:
      return { ...state, posts: action.payload.data };
    case FETCH_POST:
      return { ...state, post: action.payload };
    case LIKE:
      return { 
        ...state, 
        posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) 
      };
    case COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) => {
          // Fix type coercion issue - use strict equality
          if (post._id === action.payload._id) {
            return action.payload;
          }
          return post;
        }),
      };
    case CREATE:
      return { ...state, posts: [...state.posts, action.payload] };
    case UPDATE:
      return { 
        ...state, 
        posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) 
      };
    case DELETE:
      return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
    default:
      return state;
  }
}

export default postsReducer;

