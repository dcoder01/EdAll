import React from "react";
import { Button } from "@/components/ui/button"; 
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import defaultPic from '../../assets/svg/default_assignment.svg';

const AssignmentBanner = ({ title, marks, assignmentId, user, createdBy, time }) => {
  const params = useParams();
  const classId = params.classId;

  return (
    <div className="w-full max-w-full mx-auto my-4 shadow-lg rounded-lg bg-white"> 
      <div className="flex flex-col items-start px-4 py-6 w-full">
        <div className="flex w-full items-center">
          <img
            className="w-10 h-10 rounded object-cover mr-4 shadow"
            src={defaultPic}
            alt="Assignment Avatar"
          />
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-gray-900 -mt-1">{title}</h2>
            <small className="text-sm text-gray-700">
              {new Date(time).toDateString()}
            </small>
          </div>
        </div>
        <div className="flex flex-col w-full mt-4">
          <div className="flex flex-wrap items-center justify-between w-full space-x-4">
            <p className="text-gray-700 text-sm">Total marks: {marks}</p>
            <div className="flex space-x-4">
              <Link to={`/enter/class/${classId}/classwork/assignment/${assignmentId}`}>
                <Button variant="outline">View Assignment</Button>
              </Link>
              {createdBy === user._id && (
                <Link to={`/enter/class/${classId}/classwork/assignment/${assignmentId}/submissions`}>
                  <Button variant="outline">View Submissions</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentBanner;
