import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
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
        return thunkAPI.rejectWithValue(error.response?.data?.message|| "failed to create quiz")
    }


})


export const createAssignment= createAsyncThunk('/enter/createAssginment', async(formData, thunkAPI)=>{
    try {
        const {data}= await axios.post(`/api/v1/assignment/create`, formData, {withCredentials:true});
        // console.log(data);
        return data;
        
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message|| "failed to create assignment")
    }
})

//fetch individual assignment
export const fetchAssignment= createAsyncThunk('/enter/assignmentDetails', async(assignmentId)=>{
    try {
        const {data}= await axios.get(`/api/v1/assignment/fetch/${assignmentId}`, {withCredentials:true} )
        // console.log(data);
        
        return data;        
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message|| "failed to fetch details of assignment")
    }
})


const AssignmentSlice=createSlice({
    name: 'assignments',
    initialState:{
        success:false,
        createdBy:null,
        assignmentCreater:null,
        error:null,
        loading:false,
        assignments:[],
        quizzes:[],
        hasSubmitted:false,
        assignment:null,

        Fetchloading:false,
        Fetchsuccess:false,
        Fetcherror:null,

        downloadedAssignmentLoading:false,
        downloadedAssignmentError:false,

        downloadedSubmissionError:null,
        downloadedSubmissionLoading:false,

        uploadSubmissionError:null,
        uploadSubmissionLoading:false,
        uploadSubmissionSuccess:false,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchAssignments.pending, (state)=>{
            state.loading = true;
            state.success = false;
            state.error = null;

        }).addCase(fetchAssignments.rejected, (state, action)=>{
            state.loading=false;
            state.error=action.payload;
            state.success=false;
        }).addCase(fetchAssignments.fulfilled, (state, action)=>{
            state.loading=false;
            state.error=null;
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

        }).addCase(createQuiz.rejected, (state, action)=>{
            state.loading=false;
            state.error=action.payload;
            state.success=false;
        })
        .addCase(createQuiz.fulfilled, (state, action)=>{
            state.loading=false;
            state.error=null;
            state.success=true;
        }).addCase(createAssignment.pending, (state)=>{
            state.loading=true;
            state.error=null;
            state.success=false;
        }).addCase(createAssignment.rejected, (state, action)=>{
            state.loading=false;
            state.error=action.payload;
            state.success=false;
        }).addCase(createAssignment.fulfilled, (state)=>{
            state.loading=false;
            state.error=null;
            state.success=true;
        }).addCase(fetchAssignment.rejected, (state, action)=>{
            state.Fetchloading=false;
            state.Fetcherror=action.payload;
            state.Fetchsuccess=false;
        }).addCase(fetchAssignment.pending, (state)=>{
            state.Fetchloading=true;
            state.Fetcherror=null;
            state.Fetchsuccess=false;

        }).addCase(fetchAssignment.fulfilled, (state, action)=>{
            state.Fetchloading=false;
            state.Fetcherror=null;
            state.Fetchsuccess=true;
            state.assignment = action.payload.data.assignment;
            state.hasSubmitted = action.payload.data.hasSubmitted;
            state.assignmentCreater = action.payload.data.createdBy;


        })
    }

})

export default AssignmentSlice.reducer;