import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const tweetsSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    loadTweets: (state, action) => {
      state.value = action.payload;
    },
    addTweet: (state, action) => {
      state.value.unshift(action.payload);
    },
    likeTweet: (state, action) => {
      const index = state.value.findIndex(tweet => tweet._id === action.payload.tweetId);
      const isLiked = state.value[index].likes.some(e => e.username === action.payload.username);

      if (isLiked) {
        state.value[index].likes = state.value[index].likes.filter(e => e.username !== action.payload.username);
      } else {
        state.value[index].likes.push({ username: action.payload.username });
      }
    },
    deleteTweet: (state, action) => {
      state.value = state.value.filter(tweet => tweet._id !== action.payload);
    },
  },
});

export const { loadTweets, addTweet, likeTweet, deleteTweet } = tweetsSlice.actions;
export default tweetsSlice.reducer;
