import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";

import Spinner from "../../components/common/Spinner";
import Alert from "../../components/common/Alert";
import Banner from "../../components/common/Banner";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import happySVG from "../../assets/svg/winner.svg";
import { fetchQuiz } from '@/store/quiz';
import QuizResultDisplay from '@/components/quiz/QuizResultDisplay';










const ViewQuizResult = () => {

    const params = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const classId = params.classId;
    const quizId = params.quizId;
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const {

        loading,
        error,
        hasSubmitted,
        questions,
        totalQuizScore,
        totalUserScore,
        submission


    } = useSelector((state) => state.quizSlice);

    // console.log(questions);
    // console.log(totalUserScore);
    
    useEffect(() => {
        if (!isAuthenticated) {
            return navigate('/auth/login')
        }
        dispatch(fetchQuiz(quizId));
    }, [])


    return (
        <div>
            <Banner
                bannerBackground="greencheese"
                SVGComponent={happySVG}
                heading="Result"
                customText="View your test"
            />
            {loading?(
                <Spinner/>
            ):error?(
                <Alert color={red} message={"Some error occured!"}/>
            ):(
                hasSubmitted && (
                    <QuizResultDisplay
                        totalQuizScore={totalQuizScore}
                        totalUserScore={totalUserScore}
                        submission={submission}
                        questions={questions}
                    
                    />
                )
                
            )}

        </div>
    )
}

export default ViewQuizResult