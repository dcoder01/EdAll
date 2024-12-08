import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

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

export const fetchAllQuizSubmission = createAsyncThunk('/enter/fetchAllQuizSubmission', async (quizId, thunkAPI) => {

    try {


        const { data } = await axios.get(`/api/v1/quiz/submissions/${quizId}`, { withCredentials: true })

        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "failed to fetch the users")
    }


})


export const fetchUserQuizSubmission = createAsyncThunk('/enter/fetchUserQuizSubmission', async ({quizId, userId}, thunkAPI) => {

    try {


        const { data } = await axios.get(`/api/v1/quiz/submission/?quizId=${quizId}&userId=${userId}`, { withCredentials: true })

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
        totalQuizScore: 0,
        submission: [],
        totalUserScore: 0,

        submissions: [],
        fetchAllQuizSubmissionLoading: false,
        fetchAllQuizSubmissionError: null,
        fetchAllQuizSubmissionSuccess: false,

        fetchUserQuizSubmissionLoading:false,
        fetchUserQuizSubmissionSuccess:false,
        fetchUserQuizSubmissionError:null,
        userSubmission:[],

    },
    reducers: {
        resetSubmitState: (state) => {
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
            state.questions = action.payload.data.questions;
            state.createdBy = action.payload.data.createdBy;
            state.title = action.payload.data.title;
            state.totalQuizScore = action.payload.data.totalQuizScore;
            state.totalUserScore = action.payload.data.totalUserScore;
            state.submission = action.payload.data.submission.submission;
            // console.log("submission",state.submission);


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
        }).addCase(fetchAllQuizSubmission.fulfilled, (state, action) => {
            state.fetchAllQuizSubmissionError = null;
            state.fetchAllQuizSubmissionLoading = false;
            state.fetchAllQuizSubmissionSuccess = true;
            state.submissions = action.payload.data.submissions;
        }).addCase(fetchAllQuizSubmission.rejected, (state, action) => {
            state.fetchAllQuizSubmissionError = action.payload;
            state.fetchAllQuizSubmissionLoading = false;
            state.fetchAllQuizSubmissionSuccess = false;
        }).addCase(fetchAllQuizSubmission.pending, (state, action) => {
            state.fetchAllQuizSubmissionError = null;
            state.fetchAllQuizSubmissionLoading = true;
            state.fetchAllQuizSubmissionSuccess = false;
        }).addCase(fetchUserQuizSubmission.pending, (state, action) => {
            state.fetchAllQuizSubmissionError = null;
            state.fetchAllQuizSubmissionLoading = true;
            state.fetchAllQuizSubmissionSuccess = false;
        }).addCase(fetchUserQuizSubmission.rejected, (state, action) => {
            state.fetchAllQuizSubmissionError = action.payload;
            state.fetchAllQuizSubmissionLoading = false;
            state.fetchAllQuizSubmissionSuccess = false;
        }).addCase(fetchUserQuizSubmission.fulfilled, (state, action) => {
            state.fetchAllQuizSubmissionError = null;
            state.fetchAllQuizSubmissionLoading = false;
            state.fetchAllQuizSubmissionSuccess = true;
            state.userSubmission=action.payload.data.submission
        })
    }

})
export const { resetSubmitState } = quizSlice.actions
export default quizSlice.reducer;