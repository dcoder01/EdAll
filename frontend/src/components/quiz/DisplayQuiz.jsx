import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

const DisplayQuiz = ({ questions, setUserSubmission, userSubmission }) => {
  const optionSelectHandler = (e, questionNumber) => {
    const newSubmission = [...userSubmission];
    newSubmission[questionNumber] = parseInt(e.target.value, 10);
    setUserSubmission(newSubmission);
  };

  return (
    <form className="flex justify-center flex-col items-center w-full">
      {questions.map((question, questionindex) => (
        <Card key={questionindex} className="w-11/12 mx-auto bg-white shadow-xl rounded p-4 h-72 my-6">
          <div className="flex flex-row justify-between">
            <h3 className="font-semibold text-lg mr-4">
              Question {questionindex + 1}: {question.question}
            </h3>
          </div>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <label key={index} className="my-2 flex items-center">
                <input
                  className="w-4 h-4"
                  name={`optionSelect-${questionindex}`}
                  type="radio"
                  value={option.optionNumber}
                  onChange={(e) => optionSelectHandler(e, questionindex)}
                />
                <span className="mx-4">Option {option.optionNumber}.</span>
                <span>{option.option}</span>
              </label>
            ))}
          </div>
          <h3>
            <span className="text-lg text-green-500">+{question.correctMarks}</span>
            <span className="text-lg"> / </span>
            <span className="text-lg text-red-500">{question.incorrectMarks}</span>
          </h3>
        </Card>
      ))}
    </form>
  );
};

export default DisplayQuiz;
