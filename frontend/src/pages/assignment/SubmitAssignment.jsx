import React, { useEffect, useState } from 'react'
import Spinner from "../../components/common/Spinner";

import { toast } from "react-toastify";
import Banner from "../../components/common/Banner";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchEnterClassDetails } from '@/store/classSlice';
import OnlineClassSVG from "../../assets/svg/online_class.svg";
import Alert from '@/components/common/Alert';
import UserAssignmentSubmissionCard from '@/components/assignment/UserAssignmentSubmissionCard';
import { fetchAssignment } from '../../store/assignments';


const SubmitAssignment = () => {

    const [file, setFile] = useState(null)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();


    const classId = params.classId;
    const assignmentId = params.assignmentId;


    const {
        createdBy,
        hasSubmitted,
        assignment,
        assignmentCreater,
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
    // console.log(Fetchsuccess);
    
    useEffect(() => {
        dispatch(fetchEnterClassDetails(classId));
    }, [classId, dispatch]);

    useEffect(() => {
        if (!isAuthenticated) navigate("/auth/login");
        // if (createdBy && createdBy !== user._id) navigate("/home");
    }, [ isAuthenticated]);


    // loading the asssignment details
    useEffect(() => {
        dispatch(fetchAssignment(assignmentId));
    }, [])

    const downloadAssignmentHandler = () => {

    }
    const downloadAssignmentSubmissionHandler = () => {

    }

    const uploadAssignmentHandler = () => {

    }
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
                    <Alert color="red" message={error} />
                ) : (
                    Fetchsuccess && (
                        <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md sm:w-11/12 sm:mx-auto">
                            <div>
                                <h1 className="text-lg font-semibold">Assignment Details</h1>
                                <p className="text-sm text-gray-600 mt-2">
                                    {assignment.instructions}
                                </p>
                            </div>
                            <Button
                                onClick={downloadAssignmentHandler}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            >
                                {downloadedAssignmentLoading ? (
                                    <Spinner />
                                ) : downloadedAssignmentError ? (
                                    <Alert color="red" message={downloadedAssignmentError} />
                                ) : (
                                    "Download Attachment"
                                )}
                            </Button>
                            {user && user.id !== createdBy && (
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
    )

}

export default SubmitAssignment