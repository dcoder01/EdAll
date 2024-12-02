import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Banner from "@/components/common/Banner";
import Spinner from "../../components/common/Spinner";
import AddQuestionForm from "../../components/quiz/AddQuestionForm";
import QuestionContainer from "../../components/quiz/QuestionContainer";
import { fetchEnterClassDetails } from "../../store/classSlice";
import { createQuiz } from "../../store/assignments";
import QuestionSVG from "../../assets/svg/question.svg";



const CreateQuiz = () => {
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const { loading, success, error, createdBy } = useSelector((state) => state.assignmentSlice);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [totalMarks, setTotalMarks] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classId } = useParams();

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth/login");
    if (createdBy && createdBy !== user._id) navigate("/home");
  }, [createdBy, isAuthenticated]);

  useEffect(() => {
    dispatch(fetchEnterClassDetails(classId));
  }, [classId, dispatch]);

  const addQuestionHandler = () => setShowAddQuestion(true);

  const createQuizHandler = () => {
    if (questions.length === 0) return;
    dispatch(createQuiz({classId, questions, title}));
  };

  return (
    <>  
    <Banner
    SVGComponent={QuestionSVG}
    heading="Create Quiz"
    bannerBackground="cheese"
    customText="Create and share quiz with your class easily!"
  />
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center">
           
            <h2 className="font-bold text-2xl">Create Quiz</h2>
            <p className="text-gray-500">Easily create and share quizzes</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              className="shadow border rounded py-2 px-3 w-full text-gray-700"
              type="text"
              placeholder="Quiz Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Questions: {questions.length}</span>
              <span>Total Marks: {totalMarks}</span>
            </div>
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
              <div className="text-center text-gray-400">No questions added yet.</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 p-4 border-t">
          
            <Button variant="outline" onClick={addQuestionHandler}>
              Add Question
            </Button>
            {loading ? (
              <Spinner />
            ) : (
              <Button onClick={createQuizHandler} disabled={!title || questions.length === 0}>
                Create Quiz
              </Button>
            )}

            
        
        
        </CardFooter>
      </Card>
      <AddQuestionForm
        showAddQuestion={showAddQuestion}
        setShowAddQuestion={setShowAddQuestion}
        setQuestions={setQuestions}
        setTotalMarks={setTotalMarks}
      />
    </div>
    </>
  );
};

export default CreateQuiz;
