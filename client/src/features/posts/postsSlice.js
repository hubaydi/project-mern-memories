import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as api from "../../api";

const initialState = {
  posts: [],
  currentPage: 1,
  numberOfPages: 1,
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}

export const getPosts = createAsyncThunk(
  'posts/getPosts',
  async () => {
    const response = await api.fetchPosts()
    return response.data
  }
)

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await api.createPost(initialPost)
    return response.data
  }
)

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (id, formData) => {
    const response = await api.updatePost(id, formData)
    console.log(response.data)
    return response.data
  }
)

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId) => {
    const response = await api.deletePost(postId)
    return response.data
  }
)

export const getPostsBySearch = createAsyncThunk(
  'posts/getPostsBySearch',
  async ({ search, tags }) => {
    const response = await api.fetchPostsBySearch({ search, tags })
    return response.data
  }
)

export const getPostsByCreator = createAsyncThunk(
  'posts/getPostsByCreator',
  async (name) => {
    const response = await api.fetchPostsByCreator(name)
    return response.data
  }
)

export const getPost = createAsyncThunk(
  'posts/getPost',
  async (id) => {
    const response = await api.fetchPost(id)
    return response.data
  }
)

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (id) => {
    const response = await api.likePost(id)
    return response.data
  }
)

export const commentPost = createAsyncThunk(
  'posts/commentPost',
  async ({comment, postId}) => {
    const response = await api.commentPost(comment, postId)
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state, action) => {
        state.status = 'loading'
      }
      )
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'

        state.posts = action.payload.data.posts
        state.currentPage = action.payload.data.currentPage
        state.numberOfPages = action.payload.data.numberOfPages
        }
      )
      .addCase(getPosts.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        }
      )
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts.unshift(action.payload.data.post)
      }
      )
      .addCase(addNewPost.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        }
      )
      .addCase(updatePost.pending, (state, action) => {
          state.status = 'loading'
        }
      )
      .addCase(updatePost.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.posts = state.posts.map(post => post._id === action.payload.data.post._id ? action.payload.data.post : post)
        }
      )
      .addCase(deletePost.fulfilled, (state, action) => {
          if (!action.payload?.data.id) {
            console.log('Delete could not complete')
            console.log(action.payload)
            state.status = 'failed'
            return;
        }
          state.status = 'succeeded'
          state.posts = state.posts.filter(post => post._id !== action.payload.data.id)
        }
    )
      
      
    .addCase(getPostsBySearch.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts = action.payload.data.posts
      }
    )
    .addCase(getPostsByCreator.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts = action.payload.data.posts
      }
    )
    .addCase(getPost.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts = [action.payload.data.post]
      }
    )
    .addCase(likePost.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts = state.posts.map(post => post._id === action.payload.data.post._id ? action.payload.data.post : post)
      }
    )
    .addCase(commentPost.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts = state.posts.map(post => post._id === action.payload.data.post._id ? action.payload.data.post : post)
      }
    )
  }
})

export const selectAllPosts = (state) => state.posts?.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const selectPostById = (state, postId) => state.posts.posts.find(post => post._id === postId)
export const selectPostsByCreator = (state, userId) => state.posts.posts.filter(post => post.creator === userId)


export const { reactionAdded } = postsSlice.actions

export default postsSlice.reducer