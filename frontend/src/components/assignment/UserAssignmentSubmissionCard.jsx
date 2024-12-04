import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Alert from "../common/Alert";
import Spinner from "../common/Spinner";
import { fetchUserAssignmentSubmission } from "../../store/assignments";
import { useParams } from "react-router-dom";

const UserAssignmentSubmissionCard = ({
  uploadAssignmentHandler,
  setFile,
  file,
  uploadSubmissionLoading,
  hasSubmitted,
  uploadSubmissionSuccess,
  uploadSubmissionError,
  downloadAssignmentSubmissionHandler,
  downloadedSubmissionError,
  downloadedSubmissionLoading,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { submission, fetchUserSubmissionLoading } = useSelector(
    (state) => state.assignmentSlice
  );
  const params=useParams();
  const assignmentId=params.assignmentId;

  useEffect(() => {
    if (user) {
      const userId = user._id
      dispatch(fetchUserAssignmentSubmission({ userId, assignmentId }));
    }
  }, [user, dispatch]);

  return (
    <div className="flex flex-col items-center p-6 border border-yellow-600 shadow-lg rounded-lg w-full max-w-sm sm:w-11/12 mx-auto my-4">
      <div className="flex justify-between w-full mb-4">
        <h2 className="font-semibold">Your Work</h2>
        <span className="font-bold">
          {submission && submission.grade ? "Graded" : "Ungraded"}
        </span>
      </div>

      {fetchUserSubmissionLoading ? (
        <Spinner />
      ) : !hasSubmitted ? (
        <form
          onSubmit={uploadAssignmentHandler}
          className="flex flex-col items-center w-full"
          encType="multipart/form-data"
        >
          <label className="flex items-center justify-center w-full p-4 mb-4 border border-blue-400 rounded-lg cursor-pointer shadow-sm hover:text-blue-500">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="ml-4 text-sm">Add File</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          {file && <p className="text-sm">{file.name}</p>}

          <div className="w-full mt-4">
            {uploadSubmissionLoading ? (
              <Spinner />
            ) : uploadSubmissionError ? (
              <Alert color="blue" message={uploadSubmissionError} />
              // <div className="bg-cyan-200"> new error</div>
            ) : uploadSubmissionSuccess ? (
              <Alert color="green" message="Submission successful!" />
            ) : (
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                Submit Assignment
              </Button>
            )}
          </div>
        </form>
      ) : (
        <Button
          onClick={downloadAssignmentSubmissionHandler}
          // color="yellow"
          // variant="outline"
          className="w-full my-2  hover:bg-yellow-600 text-white"
        >
          {downloadedSubmissionLoading ? (
            <Spinner />
          ) : downloadedSubmissionError ? (
            <Alert color="red" message={downloadedSubmissionError} />
          ) : (
            <>
              <img
                src="https://img.icons8.com/cute-clipart/64/4a90e2/task.png"
                alt="Download Icon"
                className="inline-block mr-2 w-6 h-6"
              />
              Download Submission
            </>
          )}
        </Button>
      )}

      {submission && submission.grade && (
        <div className="flex justify-between w-full mt-4">
          <span className="text-green-600 font-semibold">Grade Awarded:</span>
          <span className="font-bold">{submission.grade}</span>
        </div>
      )}
    </div>
  );
};

export default UserAssignmentSubmissionCard;
