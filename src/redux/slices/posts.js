import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	const { data } = await axios.get('/posts')
	return data
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
	const { data } = await axios.get('/tags')
	return data
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', id => {
	axios.delete(`/posts/${id}`)
})

const initialState = {
	posts: {
		items: [],
		sortedItems: [],
		status: 'loading',
	},
	tags: {
		items: [],
		status: 'loading',
	},
}
const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducer: {},
	extraReducers: {
		//get posts
		[fetchPosts.pending]: state => {
			state.posts.items = []
			state.posts.status = 'loading'
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload
			state.posts.sortedItems = [...action.payload].sort(
				(a, b) => b.views_count - a.views_count
			)
			state.posts.status = 'loaded'
		},
		[fetchPosts.rejected]: state => {
			state.posts.items = []
			state.posts.status = 'error'
		},
		// get tags
		[fetchTags.pending]: state => {
			state.tags.items = []
			state.tags.status = 'loading'
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.items = action.payload
			state.tags.status = 'loaded'
		},
		[fetchTags.rejected]: state => {
			state.tags.items = []
			state.tags.status = 'error'
		},
		//delete post
		[fetchRemovePost.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(
				obj => obj.post_id !== action.meta.arg
			)
		},
		[fetchRemovePost.rejected]: state => {
			state.posts.status = 'error'
		},
	},
})
export const postsReducer = postsSlice.reducer
