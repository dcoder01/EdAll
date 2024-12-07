import React, { useEffect, useState } from 'react'
import Spinner from "../../components/common/Spinner";
import Alert from "../../components/common/Alert";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NoSubmissionSVG from "../../assets/svg/no_submission.svg";
import SubmissionCard from '@/components/assignment/SubmissionCard'
import { fetchAllQuizSubmission } from '../../store/quiz';

const ViewQuizSubmission = () => {


    const params = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();



    const classId = params.classId;
    const quizId = params.quizId;

    
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const { fetchAllQuizSubmissionLoading, fetchAllQuizSubmissionError, fetchAllQuizSubmissionSuccess, submissions } = useSelector((state) => state.quizSlice);
    

    const { currentClass } = useSelector((state) => state.class)



    useEffect(() => {
        if (!isAuthenticated) navigate("/auth/login");
        if (currentClass && currentClass.createdBy !== user._id) navigate('/home');


    }, [user, isAuthenticated]);

    useEffect(() => {
        // console.log(quizId);
        
        dispatch(fetchAllQuizSubmission(quizId));

    }, [quizId, dispatch])

    return (
        <div>

            {fetchAllQuizSubmissionLoading ? (
                <Spinner />
            ) : fetchAllQuizSubmissionError ? (
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
                                quizId={quizId}
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

export default ViewQuizSubmission