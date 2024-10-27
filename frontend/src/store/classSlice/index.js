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

// Async action for creating a class
export const createClass = createAsyncThunk('class/createClass', async ({ className, subject, room }, thunkAPI) => {
  try {
    const { data } = await axios.post('/api/v1/class/create', { className, subject, room }, { withCredentials: true });
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create class');
  }
});

// Async action for joining a class
export const joinClass = createAsyncThunk('class/joinClass', async ({classId}, thunkAPI) => {
  try {
    // console.log("Class Code:", classId);
    const { data } = await axios.post('/api/v1/class/join',  {classId} , { withCredentials: true });
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to join class');
  }
});

export const fetchEnterClassDetails = createAsyncThunk(
  'class/fetchEnterClassDetails',
  async (classId, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/v1/class/fetch/${classId}`, { withCredentials: true });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch class details');
    }
  }
);

const classSlice = createSlice({
  name: 'class',
  initialState: {
    createdClasses: [],
    joinedClasses: [],
    currentClass: {
      className: '',
      room: '',
      subject: '',
      createdBy: ''
    },
    loading: false,
    success: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        
        state.createdClasses = action.payload.createdClasses;
        state.joinedClasses = action.payload.joinedClasses;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // console.log(action.payload);
        state.createdClasses.push(action.payload.class);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(joinClass.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(joinClass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // console.log(action.payload); TODO:
        
        state.joinedClasses.push(action.payload.joinedClass);
      })
      .addCase(joinClass.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(fetchEnterClassDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnterClassDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClass = action.payload;
      })
      .addCase(fetchEnterClassDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default classSlice.reducer;
