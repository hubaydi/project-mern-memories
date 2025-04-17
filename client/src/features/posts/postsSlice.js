import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";
import * as api from "../../api";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0
})

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
  async (initialPost) => {
    const { id, ...rest } = initialPost
    const response = await api.updatePost(id, rest)
    return response.data
  }
)

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId) => {
    await api.deletePost(postId)
    return postId
  }
)

export const getPostsBySearch = createAsyncThunk(
  'posts/getPostsBySearch',
  async (searchQuery) => {
    const response = await api.fetchPostsBySearch(searchQuery)
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
  async ({ value, id }) => {
    const response = await api.comment(value, id)
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) {
          existingPost.reactions[reaction]++
      }
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state, action) => {
        state.status = 'loading'
      }
      )
      .addCase(getPosts.fulfilled, (state, action) => {
          state.status = 'succeeded'
          // Add any fetched posts to the array
          postsAdapter.upsertMany(state, action.payload)
        }
      )
      .addCase(getPosts.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        }
      )
      .addCase(addNewPost.fulfilled, (state, action) => {
          state.status = 'succeeded'
          postsAdapter.addOne(state, action.payload)
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
          postsAdapter.updateOne(state, action.payload)
        }
      )
      .addCase(deletePost.fulfilled, (state, action) => {
          if (!action.payload?.id) {
            console.log('Delete could not complete')
            console.log(action.payload)
            state.status = 'failed'
            return;
        }
          state.status = 'succeeded'
          postsAdapter.removeOne(state, action.payload.id)
        }
    )
      
      
    .addCase(getPostsBySearch.fulfilled, (state, action) => {
        state.status = 'succeeded'
        postsAdapter.upsertMany(state, action.payload)
      }
    )
    .addCase(getPostsByCreator.fulfilled, (state, action) => {
        state.status = 'succeeded'
        postsAdapter.upsertMany(state, action.payload)
      }
    )
    .addCase(getPost.fulfilled, (state, action) => {
        state.status = 'succeeded'
        postsAdapter.upsertOne(state, action.payload)
      }
    )
    .addCase(likePost.fulfilled, (state, action) => {
        state.status = 'succeeded'
        postsAdapter.upsertOne(state, action.payload)
      }
    )
    .addCase(commentPost.fulfilled, (state, action) => {
        state.status = 'succeeded'
        postsAdapter.upsertOne(state, action.payload)
      }
    )
  }
})


export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts)

export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.creator === userId)
)

export const selectPostsBySearch = createSelector(
  [selectAllPosts, (state, searchQuery) => searchQuery],
  (posts, searchQuery) => {
    if (!searchQuery) return posts
    return posts.filter(post => post.title.includes(searchQuery) || post.tags.includes(searchQuery))
  }
)

export const selectPostsByTag = createSelector(
  [selectAllPosts, (state, tag) => tag],
  (posts, tag) => {
    if (!tag) return posts
    return posts.filter(post => post.tags.includes(tag))
  }
)
export const selectPostsByDate = createSelector(
  [selectAllPosts],
  (posts) => {
    return posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
  }
)

export default postsSlice.reducer
export const { reactionAdded } = postsSlice.actions