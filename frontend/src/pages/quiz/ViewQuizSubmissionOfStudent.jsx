import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";

import Spinner from "../../components/common/Spinner";
import Alert from "../../components/common/Alert";
import Banner from "../../components/common/Banner";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import happySVG from "../../assets/svg/winner.svg";
import { fetchQuiz, fetchUserQuizSubmission } from '@/store/quiz';
import QuizResultDisplay from '@/components/quiz/QuizResultDisplay';



const ViewQuizSubmissionOfStudent = () => {
  const params = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const quizId = params.quizId;

    const userId = params.userId;
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const {

        loading,
        error,
        questions,
        totalQuizScore,
        title,
        userSubmission


    } = useSelector((state) => state.quizSlice);

    // console.log(userSubmission.user);
    // console.log(totalUserScore);
    
    useEffect(() => {
        if (!isAuthenticated) {
            return navigate('/auth/login')
        }
        dispatch(fetchQuiz(quizId));
    }, [isAuthenticated])

    useEffect(() => {
      dispatch(fetchQuiz(quizId));
      dispatch(fetchUserQuizSubmission({quizId, userId}));
    }, []);

  return (
    <div>
    <Banner
        bannerBackground="greencheese"
        SVGComponent={happySVG}
        heading="Result"
        customText={
          userSubmission && userSubmission.user
              ? `Submission of ${userSubmission.user.name} for the quiz ${title}`
              : "Loading user details!"
      }
    />
    {loading?(
        <Spinner/>
    ):error?(
        <Alert color={red} message={"Some error occured!"}/>
    ):(
        userSubmission && (
            <QuizResultDisplay
                totalQuizScore={totalQuizScore}
                totalUserScore={userSubmission.totalScore}
                submission={userSubmission.submission}
                questions={questions}
            
            />
        )
        
    )}

</div>
  )
}

export default ViewQuizSubmissionOfStudent