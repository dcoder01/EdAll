import React from "react";



const DisplayQuiz = (
  {
    questions,
    setUserSubmission,
    userSubmission
  }) => {



  const optionSelectHandler = (e, questionNumber) => {
    const newSubmission = [...userSubmission];
    newSubmission[questionNumber] = parseInt(e.target.value,10);
    setUserSubmission([...newSubmission]);
    // console.log(newSubmission);


  };


  return (
    <form className="flex justify-center flex-col items-center w-full">
      {questions.map((question, questionindex) => (
        <div
          className="bg-white w-1/2 rounded mt-4 p-4 sm:w-full"
          key={questionindex}
        >
          <div className="flex flex-row justify-between">
            <h3 className="font-semibold text-lg mr-4">
              <span>
                Question {questionindex + 1}
                {". "}
                {"  "}
              </span>
              <span>{question.question}</span>
            </h3>
          </div>
          <div className="space-y-2" >

            <div>
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
                  <span>{option.optionDesc}</span>
                </label>
              ))}
            </div>
            <h3>
              <span className="text-lg text-green-500">
                +{question.correctMarks}
              </span>
              <span className="text-lg ">{" / "}</span>
              <span className="text-lg text-red-500">
                {question.incorrectMarks}
              </span>
            </h3>
          </div>
        </div>
      ))}
    </form>
  );
};

export default DisplayQuiz;
