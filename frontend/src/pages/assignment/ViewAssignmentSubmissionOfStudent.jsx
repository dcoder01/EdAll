import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/common/Spinner";
import Banner from "@/components/common/Banner";
import Alert from "@/components/common/Alert";
import happySvg from "@/assets/svg/winner.svg";
import { Card } from "@/components/ui/card";

import {
  downloadSubmission,
  fetchAssignment,
  fetchUserAssignmentSubmission,
  gradeAssignment,
} from "@/store/assignments";
import { fetchEnterClassDetails } from "@/store/classSlice";

const ViewAssignmentSubmissionOfStudent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.userId;
  const assignmentId = params.assignmentId;
  const classId = params.classId;

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const {
    Fetchloading,
    Fetcherror,
    downloadedSubmissionError,
    downloadedSubmissionLoading,
    fetchUserSubmissionLoading,
    fetchUserSubmissionError,
    gradeAssignmentLoading,
    gradeAssignmentError,
    gradeAssignmentSuccess,
    assignmentCreater,
    submission,
    assignment,
  } = useSelector((state) => state.assignmentSlice);

  useEffect(() => {
    dispatch(fetchEnterClassDetails(classId));
  }, [classId, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (assignmentCreater && assignmentCreater !== user._id) {
      navigate("/home");
    }
  }, [assignmentCreater, user, navigate]);

  useEffect(() => {
    dispatch(fetchAssignment(assignmentId));
    dispatch(fetchUserAssignmentSubmission({ assignmentId, userId }));
  }, [assignmentId, dispatch]);

  const downloadAssignmentSubmissionHandler = () => {
    dispatch(downloadSubmission({ assignmentId, userId }));
  };

  const gradeAssignmentHandler = () => {
    const mark = Number(grade);
    if (mark > assignment.marks) {
      return;
    }
    dispatch(gradeAssignment({ assignmentId, userId, mark }));
  };

  const [grade, setGrade] = useState("");

  return (
    <>
      {Fetchloading ? (
        <Spinner />
      ) : Fetcherror ? (
        <div className="w-4/5 mx-auto my-20">
          <Alert color="red" message="Some error has occurred, please try again!" />
        </div>
      ) : (
        <div>
          <Banner
            SVGComponent={happySvg}
            heading="Submission"
            bannerBackground="greencheese"
            customText={
                submission && submission.user
                    ? `Submission of ${submission.user.name} for the assignment ${assignment && assignment.title}`
                    : "Loading user details!"
            }
          />
          <div className="w-4/5 mx-auto my-6">
            <Card className="shadow-xl rounded p-6 bg-white">
              <h3 className="text-xl font-semibold text-center mb-4">Assignment Details</h3>
              <p>
                <span className="font-medium">Total Marks: </span>
                <span className="text-green-600 font-bold">{assignment?.marks}</span>
              </p>
              {fetchUserSubmissionLoading ? (
                <Spinner />
              ) : fetchUserSubmissionError ? (
                <Alert color="red" message="Error fetching submission." />
              ) : submission?.grade ? (
                <p className="my-4">
                  <span className="font-medium">Grade awarded: </span>
                  <span className="text-green-600 font-bold">{submission.grade}</span>
                </p>
              ) : (
                <div className="my-4">
                  <label className="flex flex-col items-start">
                    <span className="font-medium">Assign Marks:</span>
                    <input
                      className="w-full mt-2 border border-gray-300 rounded p-2"
                      type="number"
                      placeholder="Marks"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    />
                  </label>
                  {gradeAssignmentLoading ? (
                    <Spinner />
                  ) : gradeAssignmentError ? (
                    <Alert color="red" message={gradeAssignmentError} />
                  ) : gradeAssignmentSuccess ? (
                    <Alert color="green" message="Grade awarded!" />
                  ) : (
                    <Button className="mt-4" onClick={gradeAssignmentHandler}>
                      Grade Submission
                    </Button>
                  )}
                </div>
              )}
            </Card>

            <Card className="shadow-xl rounded p-6 bg-white mt-6">
              <h3 className="text-xl font-semibold text-center mb-4">Student Submission</h3>
              <Button
                className="flex items-center justify-center w-full"
                onClick={downloadAssignmentSubmissionHandler}
              >
                {downloadedSubmissionLoading ? (
                  <Spinner />
                ) : downloadedSubmissionError ? (
                  <Alert color="red" message={downloadedSubmissionError} />
                ) : (
                  "Download Submission"
                )}
              </Button>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewAssignmentSubmissionOfStudent;
