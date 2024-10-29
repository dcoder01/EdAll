import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchAllUsers=createAsyncThunk('/enter/fetchAllUsers', async(classId, thunkAPI)=>{

    try {
        const {data}=await axios.get(`/api/v1/class/users/${classId}`, {withCredentials:true})
        // console.log(data.data.usersInClass.createdBy);
        
        return {
            createdBy:data.data.usersInClass.createdBy,
            
            
            userInClass:data.data.usersInClass.users,

        };

        return data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message|| "failed to fetch the users")
    }


})


const classUserSlice=createSlice({
    name: 'classUser',
    initialState:{
        success:false,
        createdBy:{},
        error:null,
        loading:false,
        userInClass:[],
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchAllUsers.pending, (state)=>{
            state.loading = true;
            state.success = false;
            state.error = null;

        }).addCase(fetchAllUsers.rejected, (state)=>{
            state.loading=false;
            state.error=true;
            state.success=false;
        }).addCase(fetchAllUsers.fulfilled, (state, action)=>{
            state.loading=false;
            state.error=false;
            state.success=true;
            // console.log(action.payload);
            
            state.userInClass=action.payload.userInClass;
            state.createdBy=action.payload.createdBy;

        })
    }

})

export default classUserSlice.reducer;