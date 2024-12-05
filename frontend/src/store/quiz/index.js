import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchQuiz = createAsyncThunk('/enter/fetchQuiz', async (quizId, thunkAPI) => {

    try {
        const { data } = await axios.get(`/api/v1/quiz/fetch/${quizId}`, { withCredentials: true })
        // console.log(data);
        return data;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "failed to fetch the users")
    }


})


export const submitQuiz = createAsyncThunk('/enter/submitQuiz', async ({ quizId, submission }, thunkAPI) => {

    try {
        const quizData = {
            quizId,
            submission
        }
        // console.log(quizData);
        
        const { data } = await axios.post(`/api/v1/quiz/submit/`, quizData, { withCredentials: true })
        // console.log(data.data);

        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "failed to fetch the users")
    }


})


const quizSlice = createSlice({
    name: 'assignments',
    initialState: {
        success: false,
        loading: false,
        error: null,
        submitSuccess: false,
        submitError: null,
        submitLoading: false,
        
        hasSubmitted: false,
        title: "",
        questions: [],
        createdBy: null,
        totalQuizScore: 0


    },
    reducers: {
        resetSubmitState:(state)=> {
            state.hasSubmitted = false; 
            state.submitSuccess = false; 
            state.submitError = null;
            state.submitLoading = false; 
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchQuiz.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;

        }).addCase(fetchQuiz.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        }).addCase(fetchQuiz.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            // console.log(action.payload);
           
            // console.log(action.payload.data);
            // console.log(state.quizDetails.questions);


            state.hasSubmitted = action.payload.data.hasSubmitted;
            state.questions=action.payload.data.questions;
            state.createdBy=action.payload.data.createdBy;
            state.title=action.payload.data.title;
            state.totalQuizScore=action.payload.data.totalQuizScore;

        }).addCase(submitQuiz.pending, (state) => {
            state.submitLoading = true;
            state.submitLoading = false;
            state.submitError = null;

        }).addCase(submitQuiz.rejected, (state, action) => {
            state.submitLoading = false;
            state.submitSuccess = false;
            state.submitError = action.payload;

        }).addCase(submitQuiz.fulfilled, (state, action) => {
            state.submitLoading = false;
            state.submitSuccess = true;
            state.submitError = null;



        })
    }

})
export const {resetSubmitState}= quizSlice.actions
export default quizSlice.reducer;