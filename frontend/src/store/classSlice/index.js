import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action for fetching classes
export const fetchClasses = createAsyncThunk('class/fetchClasses', async (_, thunkAPI) => {
    try {

      const { data } = await axios.get('/api/v1/class/fetch', { withCredentials: true });
      return data.classes;
    } catch (err) {
     
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Some error occurred');
    }
  });
  

const classSlice = createSlice({
  name: 'class',
  initialState: {
    createdClasses: [],
    joinedClasses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;

        console.log(action.payload);
        
        state.createdClasses = action.payload.createdClasses;
        state.joinedClasses = action.payload.joinedClasses;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default classSlice.reducer;
