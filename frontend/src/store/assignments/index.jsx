import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
export const fetchAssignments = createAsyncThunk('/enter/fetchAssignments', async (classId, thunkAPI) => {

    try {
        const { data } = await axios.get(`/api/v1/quiz/fetch/all/${classId}`, { withCredentials: true })
        // console.log(data.data);

        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "failed to fetch the users")
    }


})


export const createQuiz = createAsyncThunk('/enter/createQuiz', async ({ classId, title, questions }, thunkAPI) => {

    try {
        // console.log(classId);
        // console.log(title);
        const { data } = await axios.post(`/api/v1/quiz/create`, { classId, title, questions }, { withCredentials: true })

        // console.log(data);

        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "failed to create quiz")
    }


})


export const createAssignment = createAsyncThunk('/enter/createAssginment', async (formData, thunkAPI) => {
    try {
        const { data } = await axios.post(`/api/v1/assignment/create`, formData, { withCredentials: true });
        // console.log(data);
        return data;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "failed to create assignment")
    }
})

//fetch individual assignment
export const fetchAssignment = createAsyncThunk('/enter/assignmentDetails', async (assignmentId) => {
    try {
        const { data } = await axios.get(`/api/v1/assignment/fetch/${assignmentId}`, { withCredentials: true })
        // console.log(data);

        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "failed to fetch details of assignment")
    }
})

//upload assignment
export const uploadSubmission = createAsyncThunk('/enter/UploadSubmission', async (formData, thunkAPI) => {
    try {
        const { data } = await axios.post(`/api/v1/assignment/submit`, formData, { withCredentials: true });
        // console.log(formData);
        return data;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "failed to create assignment")
    }
})

//download assignment
export const downloadAssignment = createAsyncThunk('/enter/downloadAssignment', async (assignmentId, thunkAPI) => {
    try {
        const response = await axios.get(
            `/api/v1/assignment/getFileExtension/${assignmentId}`,
            { withCredentials: true }
        );

        const fileExtension = response.data?.data?.fileExtension || "";
        // console.log(fileExtension);

        // Fetch the file itself
        const fileResponse = await axios.get(
            `/api/v1/assignment/download/${assignmentId}`,
            {
                withCredentials: true, responseType: 'blob',
            }
        );

        const blob = new Blob([fileResponse.data]);
        const fileName = `Assignment${fileExtension}`;
        // const fileName = `Assignment.jpg`;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();


        return { success: true };

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "failed to download assignment")
    }
})

//download submission

export const downloadSubmission = createAsyncThunk('/enter/downloadSubmission', async ({ userId, assignmentId }, thunkAPI) => {
    try {

        const queryString = userId ? `?userId=${userId}` : ``;
        const response = await axios.get(
            `/api/v1/assignment/submission/getFileExtension/${assignmentId}${queryString}`,
            { withCredentials: true }
        );
        const fileExtension = response.data?.data?.fileExtension || "";
        // console.log(response.data);

        const fileResponse = await axios.get(
            `/api/v1/assignment/download/submission/${assignmentId}${queryString}`,
            { withCredentials: true, responseType: 'blob' }
        );
        const blob = new Blob([fileResponse.data]);
        const fileName = `submission${fileExtension}`;
        // const fileName = `Assignment.jpg`;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();


        return { success: true };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "failed to download  submission")
    }
})

//details of the submitted assignment of the user. -> graded or not ?

export const fetchUserAssignmentSubmission = createAsyncThunk('/enter/fetchUserSubmission', async ({ userId, assignmentId }, thunkAPI) => {
    try {
        // console.log(assignmentId);
        // console.log(userId);
        const { data } = await axios.get(
            `/api/v1/assignment/submission/?assignmentId=${assignmentId}&userId=${userId}`,
            { withCredentials: true }
        );
        // console.log(data);
        return data;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "failed to fetch submission asssignment details")
    }
})
export const fetchAllSubmission = createAsyncThunk('/enter/fetchAllSubmission', async (assignmentId, thunkAPI) => {
    try {
        // console.log(assignmentId);
        // console.log(userId);
        const { data } = await axios.get(
            `/api/v1/assignment/submissions/${assignmentId}`,
            { withCredentials: true }
        );
        console.log(data);
        return data;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "failed to fetch submission asssignment details")
    }
})






const AssignmentSlice = createSlice({
    name: 'assignments',
    initialState: {
        success: false,
        createdBy: null, //class creator
        assignmentCreater: null,
        error: null,
        loading: false,
        assignments: [],
        quizzes: [],
        hasSubmitted: false,
        assignment: null,
        submission: null,
        fetchUserSubmissionLoading: false,

        Fetchloading: false,
        Fetchsuccess: false,
        Fetcherror: null,

        downloadedAssignmentLoading: false,
        downloadedAssignmentError: false,

        downloadedSubmissionError: null,
        downloadedSubmissionLoading: false,

        uploadSubmissionError: null,
        uploadSubmissionLoading: false,
        uploadSubmissionSuccess: false,

        fetchAllSubmissionLoading: false,
        fetchAllSubmissionError: null,
        fetchAllSubmissionSuccess: false,
        submissions: [],


    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAssignments.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;

        }).addCase(fetchAssignments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        }).addCase(fetchAssignments.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            // console.log(action.payload);

            state.assignments = action.payload.data.assignments;
            state.quizzes = action.payload.data.quizzes;
            state.createdBy = action.payload.data.createdBy;

        })
            .addCase(createQuiz.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;

            }).addCase(createQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            .addCase(createQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
            }).addCase(createAssignment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            }).addCase(createAssignment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            }).addCase(createAssignment.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.success = true;
            }).addCase(fetchAssignment.rejected, (state, action) => {
                state.Fetchloading = false;
                state.Fetcherror = action.payload;
                state.Fetchsuccess = false;
            }).addCase(fetchAssignment.pending, (state) => {
                state.Fetchloading = true;
                state.Fetcherror = null;
                state.Fetchsuccess = false;

            }).addCase(fetchAssignment.fulfilled, (state, action) => {
                state.Fetchloading = false;
                state.Fetcherror = null;
                state.Fetchsuccess = true;
                state.assignment = action.payload.data.assignment;
                state.hasSubmitted = action.payload.data.hasSubmitted;
                state.assignmentCreater = action.payload.data.createdBy;


            }).addCase(uploadSubmission.pending, (state) => {
                state.uploadSubmissionError = null;
                state.uploadSubmissionLoading = true;
                state.uploadSubmissionSuccess = false;

            }).addCase(uploadSubmission.rejected, (state, action) => {
                state.uploadSubmissionError = action.payload;
                state.uploadSubmissionLoading = false;
                state.uploadSubmissionSuccess = false;

            }).addCase(uploadSubmission.fulfilled, (state, action) => {
                state.uploadSubmissionError = null;
                state.uploadSubmissionLoading = false;
                state.uploadSubmissionSuccess = true;


            }).addCase(downloadAssignment.rejected, (state, action) => {

                state.downloadedAssignmentError = action.payload;
                state.downloadedAssignmentLoading = false;
            }).addCase(downloadAssignment.pending, (state, action) => {
                state.downloadedAssignmentError = null;
                state.downloadedAssignmentLoading = true;

            }).addCase(downloadAssignment.fulfilled, (state, action) => {

                state.downloadedAssignmentError = null;
                state.downloadedAssignmentLoading = false;

            }).addCase(downloadSubmission.rejected, (state, action) => {

                state.downloadedSubmissionError = action.payload;
                state.downloadedSubmissionLoading = false;
            }).addCase(downloadSubmission.pending, (state, action) => {
                state.downloadedSubmissionError = null;
                state.downloadedSubmissionLoading = true;

            }).addCase(downloadSubmission.fulfilled, (state, action) => {

                state.downloadedSubmissionError = null;
                state.downloadedSubmissionLoading = false;

            }).addCase(fetchUserAssignmentSubmission.fulfilled, (state, action) => {
                state.fetchUserSubmissionLoading = false;
                state.submission = action.payload.data.submission;

            }).addCase(fetchUserAssignmentSubmission.rejected, (state, action) => {
                state.fetchUserSubmissionLoading = false;


            }).addCase(fetchUserAssignmentSubmission.pending, (state, action) => {
                state.fetchUserSubmissionLoading = true;


            }).addCase(fetchAllSubmission.pending, (state, action) => {
                state.fetchAllSubmissionLoading = true;
                state.fetchAllSubmissionError = null;
                state.fetchAllSubmissionSuccess = false;


            }).addCase(fetchAllSubmission.rejected, (state, action) => {
                state.fetchAllSubmissionError = action.payload;
                state.fetchAllSubmissionLoading = false;
                state.fetchAllSubmissionSuccess = false;

            }).addCase(fetchAllSubmission.fulfilled, (state, action) => {
                state.fetchAllSubmissionSuccess = true;
                state.submissions = action.payload.data.submissions;
                state.fetchAllSubmissionError = null;
                state.fetchAllSubmissionLoading = false;


            })
    }

})

export default AssignmentSlice.reducer;