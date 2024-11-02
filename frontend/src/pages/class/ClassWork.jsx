import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignments } from "../../store/assignments"
import { useLocation, useNavigate } from "react-router";
import { fetchEnterClassDetails } from "../../store/classSlice";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import Banner from "../../components/common/Banner";
import TaskSVG from "../../assets/svg/tasks.svg";
import Dropdown from "@/components/class-view/Dropdown";
import TabComponent from "@/components/class-view/TabComponent";

const ClassWork = () => {
  const { quizzes, loading, error, assignments, createdBy } = useSelector(
    (state) => state.assignmentSlice
  );

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const urlPath = location.pathname;
  const classId = urlPath.split("/")[3];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    } else {
      dispatch(fetchEnterClassDetails(classId));
      dispatch(fetchAssignments(classId));
    }
  }, [isAuthenticated, dispatch, classId, navigate]);

  return (
    <>
      <Banner
        SVGComponent={TaskSVG}
        heading="ClassWork"
        bannerBackground="meteor"
        customText="All your assignments and quizzes in one place"
        textColor="gray"
      />
      
      <div className="container mx-auto my-8 px-4 sm:px-8">
        <div className="my-4 flex justify-center">
          {user && user._id === createdBy && <Dropdown/>}
        </div>
        
        {loading ? (
          <Skeleton className="h-36 w-full mx-auto" /> 
        ) : error ? (
          <Alert variant="destructive" className="my-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          quizzes && (
            <TabComponent
            categories={{
              Quizzes: quizzes,
              Assignments: assignments,
            }}
            createdBy={createdBy}
            user={user}
          />
          )
        )}
      </div>
    </>
  );
};

export default ClassWork;
