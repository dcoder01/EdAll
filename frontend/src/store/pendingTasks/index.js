import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPendingTasks = createAsyncThunk(
  'assignments/fetchPendingTasks',
  async (classId, thunkAPI) => {
    try {

      const { user } = thunkAPI.getState().auth;
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Make both API calls in parallel
      const [quizzesResponse, assignmentsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/quiz/fetch/pending/${classId}`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/assignment/fetch/pending/${classId}`, config),
      ]);

      // Extract and return the combined data
      return {
        quizzes: quizzesResponse.data.data.pendingQuizzes,
        assignments: assignmentsResponse.data.data.pendingAssignments,
      };

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Some error occurred while fetching pending tasks'
      );
    }
  }
);

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState: {
    assignments: [],
    quizzes: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAssignments: (state) => {
      state.assignments = [];
      state.quizzes = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.assignments;
        state.quizzes = action.payload.quizzes;
      })
      .addCase(fetchPendingTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer;