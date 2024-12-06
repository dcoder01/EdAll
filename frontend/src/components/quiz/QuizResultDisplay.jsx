import React from 'react'
import { Card } from '@/components/ui/card'


const QuizResultDisplay = ({
    questions,
    totalQuizScore,
    totalUserScore,
    submission }) => {

    // console.log(submission)
    
    // console.log(questions);
    
    


    return (
        <div className='flex justify-center flex-col items-center w-full'>

            <Card className="p-6 bg-green-600">
                <h2 className="font-medium">Scored {totalUserScore} out of {totalQuizScore}</h2>
            </Card>

            {questions && submission &&

                questions.map((question, quesIndex) => (
                    <Card key={quesIndex} className="w-11/12 mx-auto bg-white shadow-xl rounded p-4 h-72 my-6">

                        <div className="flex flex-row justify-between">
                            <h3 className="font-semibold text-lg mr-4">
                                <span>
                                    Question {quesIndex + 1}
                                    {". "}
                                    {"  "}
                                </span>
                                <span>{question.question}</span>
                            </h3>
                        </div>

                        <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                                <div
                                    key={optionIndex}
                                    className={`flex flex-row my-2 ${option.optionNumber === question.correctOption+1 ||
                                        (question.correctOption+1 === submission[quesIndex].option &&
                                            option.optionNumber === question.correctOption+1) ?
                                        ("border-green-600 border rounded bg-green-100") :
                                        (option.optionNumber === submission[quesIndex].option &&
                                            "border-red-600 border rounded bg-red-100")


                                        }
                                        `}

                                >

                                    <div>
                                        <span>
                                            Option {option.optionNumber}
                                            {". "}
                                            {" "}
                                        </span>
                                        <span>
                                            {option.option}
                                        </span>
                                    </div>

                                </div>
                            ))}
                        </div>
                        <h3>
                            <span className="text-lg text-green-500">+{question.correctMarks}</span>
                            <span className="text-lg"> / </span>
                            <span className="text-lg text-red-500">{question.incorrectMarks}</span>
                        </h3>

                    </Card>

                ))



            }



        </div>
    )
}

export default QuizResultDisplay