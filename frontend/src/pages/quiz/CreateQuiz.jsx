import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Banner from "../../components/common/Banner";
import Spinner from "../../components/common/Spinner";
import Alert from "../../components/common/Alert";
import AddQuestionForm from "../../components/quiz/AddQuestionForm";
import QuestionContainer from "../../components/quiz/QuestionContainer";
import { fetchEnterClassDetails } from "../../store/classSlice";
import { createQuiz } from "../../store/assignments";
import QuestionSVG from "../../assets/svg/question.svg";
import AddQuestionSVG from "../../assets/svg/add_question.svg";

const CreateQuiz = () => {
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const { loading, success, error, createdBy } = useSelector((state) => state.assignmentSlice);
    const { isAuthenticated, user } = useSelector(
        (state) => state.auth
    );
    // const { createdBy } = useSelector((state) => state.enterClassDetails);

    const [totalMarks, setTotalMarks] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { classId } = useParams();

    useEffect(() => {
        if (!isAuthenticated) return navigate("/auth/login");
        if (createdBy && createdBy !== user._id) return navigate("/home");
    }, [createdBy, isAuthenticated]);

    useEffect(() => {
        dispatch(fetchEnterClassDetails(classId));
    }, [classId, dispatch]);

    const addQuestionHandler = () => setShowAddQuestion(true);

    const createQuizHandler = () => {
        if (questions.length === 0) return;
        dispatch(createQuiz(classId, questions, title));
    };

    return (
        <>
            <Banner
                SVGComponent={QuestionSVG}
                heading="Create Quiz"
                bannerBackground="cheese"
                customText="Create and share quizzes easily!"
            />
            <section className="p-4 h-full">
                <AddQuestionForm
                    showAddQuestion={showAddQuestion}
                    setShowAddQuestion={setShowAddQuestion}
                    setQuestions={setQuestions}
                    setTotalMarks={setTotalMarks}
                />
                <div className="bg-white py-2 flex flex-col items-center border rounded">
                    <h2 className="font-bold text-2xl my-2">List of Questions:</h2>
                    <div className="flex flex-row justify-between w-full px-6">
                        <input
                            className="shadow border rounded py-2 px-3 mx-4 text-gray-700"
                            type="text"
                            placeholder="Quiz Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div>
                            <h2>Total Questions: {questions.length}</h2>
                            <h2>Total Marks: {totalMarks}</h2>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        {questions.length > 0 ? (
                            questions.map((question, index) => (
                                <QuestionContainer
                                    key={index}
                                    questionBody={question.question}
                                    options={question.options}
                                    correctOption={question.correctOption}
                                    correctMarks={question.correctMarks}
                                    incorrectMarks={question.incorrectMarks}
                                />
                            ))
                        ) : (
                            <img src={AddQuestionSVG} alt="Add Question" />
                        )}
                        <div className="flex space-x-4 mt-4">
                            <button onClick={addQuestionHandler}>Add question</button>
                            {loading ? <Spinner /> : <button onClick={createQuizHandler}>Create quiz</button>}
                        </div>
                        <div className="mt-4">
                            {error ? <Alert color="red" message={error} /> : success && <Alert color="green" message="Quiz created!" />}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CreateQuiz;
