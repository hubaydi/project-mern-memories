import { configureStore } from "@reduxjs/toolkit";
import postsReducer from '../features/posts/PostsSlice';
import usersReducer from '../features/users/usersSlice';
import profileReducer from '../features/profile/profileSlice';


export const store = configureStore({
    reducer: {
        posts: postsReducer,
        users: usersReducer,
        profile: profileReducer
    }
})