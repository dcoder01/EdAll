import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "../../components/common/Spinner";
import Alert from "../../components/common/Alert";
import Banner from "../../components/common/Banner";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BannerSVG from "../../assets/svg/online_class.svg";
import { fetchQuiz, submitQuiz } from '@/store/quiz';
import DisplayQuiz from '@/components/quiz/DisplayQuiz';
import QuestionContainer from '@/components/quiz/QuestionContainer';
import {resetSubmitState} from '../../store/quiz/index'





const TakeQuiz = () => {

    const params = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const location=useLocation();


    const classId = params.classId;
    const quizId = params.quizId;

    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const {
        title,
        questions,
        createdBy,
        loading,
        error,
        hasSubmitted,
        totalQuizScore,
        submitSuccess,
        submitError,
        submitLoading } = useSelector((state) => state.quizSlice);
    // console.log(questions);

    const [userSubmission, setUserSubmission] = useState([]);


    // console.log(hasSubmitted);

    //this is for proper navigation
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
       
        setIsLoading(false);
    }, [hasSubmitted]);

    //this is for reseting the states for proper navigation
    useEffect(() => {
        if (location.pathname.includes("/classwork")) {
            dispatch(resetSubmitState());  
        }
    }, [dispatch, location.pathname]);

    useEffect(() => {
        if (!isAuthenticated) navigate("/auth/login");

    }, [user, isAuthenticated]);

    //this is for navigation
    useEffect(() => {
        if (!isLoading  && hasSubmitted)
            navigate(`/enter/class/${classId}/classwork/quiz/${quizId}/results`);
    }, [submitSuccess,hasSubmitted, navigate, classId, quizId]);

    useEffect(() => {
        dispatch(fetchQuiz(quizId));
    }, [quizId, dispatch, location.pathname])



    const submitQuizHandler = () => {


        const submission = new Array(questions.length).fill(-1);
        userSubmission.forEach((s, index) => {
            if (s !== undefined) {
                submission[index] = parseInt(s)
            }
        })
        
        dispatch(submitQuiz({ quizId, submission })).then((data)=>{

            if(data?.payload?.success){
                navigate(`/enter/class/${classId}/classwork/quiz/${quizId}/results`);
            }

        })
    
    }


    const componentMarks = (
        <div className="border rounded shadow-lg p-6 border-green-400 bg-green-200">
            <h2 className="font-medium">Total Questions: {questions?.length || 0}</h2>
            <h2 className="font-medium">Total Marks: {totalQuizScore || 0}</h2>
        </div>
    );

    const componentIfNotSubmitted = (

        <div className="flex items-center flex-col w-full">

            <DisplayQuiz
                questions={questions}
                createdBy={createdBy}
                setUserSubmission={setUserSubmission}
                userSubmission={userSubmission}
            />
            <div className="my-4">
                {submitLoading ? (
                    <Spinner />
                ) : submitError ? (
                    <Alert color="red" message={submitError} />
                ) : submitSuccess ? (
                    <Alert color="green" message="Quiz submitted successfully!" />
                ) : null}
            </div>
            {user && user._id !== createdBy && (
                <Button onClick={submitQuizHandler}>Submit Quiz</Button>
            )}

        </div>
    );








    return (
        <div>
            <Banner
                Banner
                bannerBackground="tornado"
                SVGComponent={BannerSVG}
                heading={title}
                customText="Take the quiz and get results immediately"
            />

            {loading ? (
                <Spinner />
            ) : error ? (
                <Alert color={red} message={error} />
            ) : createdBy === user._id ? (
                <div className="bg-white py-2 flex flex-col items-center border rounded mx-auto w-4/5 sm:w-full">
                    {componentMarks}

                    {questions &&
                        questions.map((question, index) => (
                            
                            <QuestionContainer
                                key={index}
                                questionBody={question.question}
                                options={question.options}
                                correctMarks={question.correctMarks}
                                incorrectMarks={question.correctMarks}
                                correctOption={question.correctOption}
                            />

                        ))

                    }
                </div>
            ) : (
                !hasSubmitted ? (

                    <div className="flex flex-col items-center">
                        {componentMarks}
                        {componentIfNotSubmitted}
                    </div>
                ) : <Spinner />
            )
            }

        </div>

    )
}

export default TakeQuiz