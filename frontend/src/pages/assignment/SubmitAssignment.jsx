import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Spinner from "../../components/common/Spinner";
import Banner from "../../components/common/Banner";
import Alert from "@/components/common/Alert";
import UserAssignmentSubmissionCard from "@/components/assignment/UserAssignmentSubmissionCard";
import OnlineClassSVG from "../../assets/svg/online_class.svg";
import {
  downloadAssignment,
  downloadSubmission,
  fetchAssignment,
  uploadSubmission,
} from "../../store/assignments";
import { fetchEnterClassDetails } from "@/store/classSlice";

const SubmitAssignment = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const classId = params.classId;
  const assignmentId = params.assignmentId;

  const {
    createdBy,
    hasSubmitted,
    assignment,
    Fetchloading,
    Fetchsuccess,
    Fetcherror,

    downloadedAssignmentLoading,
    downloadedAssignmentError,

    downloadedSubmissionError,
    downloadedSubmissionLoading,

    uploadSubmissionError,
    uploadSubmissionLoading,
    uploadSubmissionSuccess,
  } = useSelector((state) => state.assignmentSlice);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEnterClassDetails(classId));
  }, [classId, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(fetchAssignment(assignmentId));
  }, [assignmentId, dispatch]);

  const downloadAssignmentHandler = () => {
    dispatch(downloadAssignment(assignmentId));
  };

  const downloadAssignmentSubmissionHandler = () => {
    const userId = user._id;
    dispatch(downloadSubmission({ assignmentId, userId }));
  };

  const uploadAssignmentHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", assignmentId);
    formData.append("classId", classId);

    dispatch(uploadSubmission(formData));
  };

  return (
    <>
      <Banner
        SVGComponent={OnlineClassSVG}
        heading={assignment ? assignment.title : "Loading..."}
        bannerBackground="tornado"
        customText={assignment && `${assignment.marks} marks`}
      />

      <div className="mx-auto mb-16">
        {Fetchloading ? (
          <Spinner />
        ) : Fetcherror ? (
          <Alert color="red" message={Fetcherror} />
        ) : (
          Fetchsuccess && (
            <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md sm:w-11/12 sm:mx-auto max-w-lg">
              <div>
                <h1 className="text-lg font-semibold">Assignment Details</h1>
                <p className="text-sm text-gray-600 mt-2">
                  {assignment.instructions}
                </p>
              </div>
              <Button
                onClick={downloadAssignmentHandler}
                className="w-full bg-black text-white"
              >
                {downloadedAssignmentLoading ? (
                  <Spinner />
                ) : downloadedAssignmentError ? (
                  <Alert color="red" message={downloadedAssignmentError} />
                ) : (
                  "Download Attachment"
                )}
              </Button>
              {user && user._id !== createdBy && (
                <UserAssignmentSubmissionCard
                  uploadAssignmentHandler={uploadAssignmentHandler}
                  setFile={setFile}
                  file={file}
                  uploadSubmissionLoading={uploadSubmissionLoading}
                  uploadSubmissionError={uploadSubmissionError}
                  uploadSubmissionSuccess={uploadSubmissionSuccess}
                  hasSubmitted={hasSubmitted}
                  downloadAssignmentSubmissionHandler={
                    downloadAssignmentSubmissionHandler
                  }
                  downloadedSubmissionLoading={downloadedSubmissionLoading}
                  downloadedSubmissionError={downloadedSubmissionError}
                />
              )}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default SubmitAssignment;
