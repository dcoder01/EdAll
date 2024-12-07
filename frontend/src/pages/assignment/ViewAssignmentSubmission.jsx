import React, { useEffect, useState } from 'react'

import Spinner from "../../components/common/Spinner";
import Alert from "../../components/common/Alert";
import Banner from "../../components/common/Banner";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NoSubmissionSVG from "../../assets/svg/no_submission.svg";

import { Card } from "@/components/ui/card";
import { fetchAllSubmission } from '@/store/assignments';
import SubmissionCard from '@/components/assignment/SubmissionCard';

const ViewAssignmentSubmission = () => {




    const params = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();



    const classId = params.classId;
    const assignmentId = params.assignmentId;

    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const { fetchAllSubmissionLoading, fetchAllSubmissionError, fetchAllSubmissionSuccess, createdBy, submissions } = useSelector((state) => state.assignmentSlice);




    useEffect(() => {
        if (!isAuthenticated) navigate("/auth/login");
        if (createdBy && createdBy !== user._id) navigate('/home');


    }, [user, isAuthenticated]);

    useEffect(() => {
        dispatch(fetchAllSubmission(assignmentId))
    }, [])

    return (
        <div>

            {fetchAllSubmissionLoading ? (
                <Spinner />
            ) : fetchAllSubmissionError ? (
                <Alert color={"red"} message={"some error occured"} />
            ) : (
                <>
                    {submissions &&
                        submissions.map((submission) => (
                            <SubmissionCard
                                classId={classId}
                                name={submission.user.name}
                                email={submission.user.email}
                                picture={submission.user.picture}
                                userId={submission.user._id}
                                assignmentId={assignmentId}
                                key={submission.user._id}

                            />
                        ))
                    }
                    {submissions && submissions.length === 0 && (
                        <div className="mx-auto h-56 w-56 my-16">
                            <img alt="svg for ui" src={NoSubmissionSVG} />
                            <p
                                style={{
                                    fontFamily: ["Poppins", "sans-serif"],
                                }}
                            >
                                No submissions found
                            </p>
                        </div>
                    )}

                </>
            )

            }



        </div>
    )
}

export default ViewAssignmentSubmission