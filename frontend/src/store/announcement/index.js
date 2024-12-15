import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (classId, thunkAPI) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/announcement/fetch/${classId}`, { withCredentials: true });
      return data;
    //   TODO:
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch announcements');
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  'announcements/createAnnouncement',
  async ({ classId, content }, thunkAPI) => {

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/announcement/create/${classId}`, { content }, { withCredentials: true });
      thunkAPI.dispatch(fetchAnnouncements(classId));
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create announcement');
    }
  }
);

// Delete Announcement
export const deleteAnnouncement = createAsyncThunk(
  'announcements/deleteAnnouncement',
  async ( announcementId , thunkAPI) => {
    // console.log();
    
    try {
     const {data}= await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/announcement/delete/${announcementId}`, { withCredentials: true });
    //  console.log(dataannouncementId);
      return data; // Return the announcementId for deletion confirmation
      
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete announcement');
    }
  }
);

const announcementSlice = createSlice({
  name: 'announcements',
  initialState: {
    announcements: [],
    loading: false,
    error: null,
    success:false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success=false;

      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload.announcements;
        state.success=true;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success=false;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        // state.announcements.unshift(action.payload);
        state.success=true;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.announcements = state.announcements.filter(
          (announcement) => announcement._id !== action.payload.announcementId
        );
        state.success = true;
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default announcementSlice.reducer;