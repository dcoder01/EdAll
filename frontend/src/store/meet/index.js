import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getToken = createAsyncThunk(
  'meet/getToken',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/get-token`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      //   console.log("token",data.token);

      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch token"
      );
    }
  }
);

const meetSlice = createSlice({
  name: 'meet',
  initialState: {
    token: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getToken.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload.token);
        state.token = action.payload.token;

        state.success = true;
        state.error = null;
      })
      .addCase(getToken.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.success = false;
        state.error = action.payload || "Token fetch failed";
      });
  }
});

export default meetSlice.reducer;