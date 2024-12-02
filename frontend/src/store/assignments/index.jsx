import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchAssignments=createAsyncThunk('/enter/fetchAssignments', async(classId, thunkAPI)=>{

    try {
        const {data}=await axios.get(`/api/v1/quiz/fetch/all/${classId}`, {withCredentials:true})
        // console.log(data.data);
  
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message|| "failed to fetch the users")
    }


})


export const createQuiz=createAsyncThunk('/enter/createQuiz', async({classId,title,questions},  thunkAPI)=>{

    try {
        // console.log(classId);
        // console.log(title);
        const {data}=await axios.post(`/api/v1/quiz/create`,{classId,title,questions}, {withCredentials:true})
       
        // console.log(data);
  
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message|| "failed to fetch the users")
    }


})


const AssignmentSlice=createSlice({
    name: 'assignments',
    initialState:{
        success:false,
        createdBy:null,
        error:null,
        loading:false,
        assignments:[],
        quizzes:[],
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchAssignments.pending, (state)=>{
            state.loading = true;
            state.success = false;
            state.error = null;

        }).addCase(fetchAssignments.rejected, (state)=>{
            state.loading=false;
            state.error=true;
            state.success=false;
        }).addCase(fetchAssignments.fulfilled, (state, action)=>{
            state.loading=false;
            state.error=false;
            state.success=true;
            // console.log(action.payload);
            
            state.assignments=action.payload.data.assignments;
            state.quizzes=action.payload.data.quizzes;
            state.createdBy=action.payload.data.createdBy;

        })
        .addCase(createQuiz.pending, (state)=>{
            state.loading = true;
            state.success = false;
            state.error = null;

        }).addCase(createQuiz.rejected, (state)=>{
            state.loading=false;
            state.error=true;
            state.success=false;
        })
        .addCase(createQuiz.fulfilled, (state, action)=>{
            state.loading=false;
            state.error=false;
            state.success=true;
        })
    }

})

export default AssignmentSlice.reducer;