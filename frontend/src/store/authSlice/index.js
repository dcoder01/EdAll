import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks for login and register
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, userData,{withCredentials:true});
    // console.log(response);

    return response.data;
  } catch (error) {


    return thunkAPI.rejectWithValue(error.response?.data?.message || "login failed");
  }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/register`, userData,{withCredentials:true});
 
    return response.data;
  } catch (error) {
    // console.log(error);


    return thunkAPI.rejectWithValue(error.response?.data?.message || "signup failed");
  }
});

// Thunk for logging out (if needed)
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/logout`, {
      withCredentials: true,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
    
    
    localStorage.removeItem('user');
    
    return {};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


//chech-auth for cookie storage and validation

export const checkAuth= createAsyncThunk('/auth/checkAuth', async()=>{
  try {
    // console.log(import.meta.env.VITE_API_URL);
    
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/check-auth`,
      {
        withCredentials: true,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
 
    return response.data;
  } catch (error) {

    return thunkAPI.rejectWithValue(error.response?.data?.message || "Authentication Failed");
  }
})



// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        // console.log(action.payload);

        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });

    // Register cases
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });

    // Logout cases
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
      //check auth

    builder
    .addCase(checkAuth.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(checkAuth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.success ? action.payload.user : null;
      state.isAuthenticated = action.payload.success;
    })
    .addCase(checkAuth.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});


export const { setUser } = authSlice.actions;
export default authSlice.reducer;
