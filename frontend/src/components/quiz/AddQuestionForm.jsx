import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { X } from "lucide-react";
import { toast as reactToast } from "react-toastify";


const AddQuestionForm = ({
  showAddQuestion,
  setShowAddQuestion,
  setQuestions,
  setTotalMarks,
}) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [optionDesc, setOptionDesc] = useState("");
  const [correctOption, setCorrectOption] = useState(-1);
  const [correctMarks, setCorrectMarks] = useState(1);
  const [incorrectMarks, setIncorrectMarks] = useState(0);


  const resetFields = () => {
    setQuestion("");
    setOptions([]);
    setOptionDesc("");
    setCorrectOption(-1);
    setCorrectMarks(1);
    setIncorrectMarks(0);
    setShowAddQuestion(false);
  };

  const addOptionHandler = () => {
    if (!optionDesc.trim()) return;
    setOptions([...options, { option: optionDesc, optionNumber: options.length + 1 }]);
    setOptionDesc("");
  };

  const createQuestionHandler = () => {
    if (!question || options.length === 0 || correctOption === -1) {


      reactToast.error(
        "one or more fields are invalid."
      );


      resetFields();
      return;
    }
    const newQuestion = {
      question,
      options,
      correctOption,
      //big brain :) 
      correctMarks:Number(correctMarks),
      incorrectMarks:Number(incorrectMarks),
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setTotalMarks((prev) => prev + (newQuestion.correctMarks));
    resetFields();
  };

  if (!showAddQuestion) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white">

        <CardHeader className="flex flex-row justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">Add Question</h2>
          <Button variant="ghost" size="icon" onClick={resetFields}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>



        <CardContent className="p-4 space-y-4">
          {/* Question Text */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Question</label>
            <Textarea
              placeholder="Enter your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Options Section */}
          <div className="space-y-2">
            {options.length > 0 && (
              <div className="space-y-2">
                {options.map((opt, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      value={index}
                      onChange={() => setCorrectOption(index)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label>{opt.option}</label>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Option description"
                value={optionDesc}
                onChange={(e) => setOptionDesc(e.target.value)}
              />
              <Button onClick={addOptionHandler}>Add Option</Button>
            </div>
          </div>

          {/* Marks Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Marks for Correct Answer</label>
              <Input
                type="number"
                min={-Infinity}
                value={correctMarks}
                onChange={(e) => setCorrectMarks((e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Marks for Incorrect Answer</label>
              <Input
                type="number"
                value={incorrectMarks}
                onChange={(e) => setIncorrectMarks((e.target.value))}
              />
            </div>
          </div>

          {/* TODO:add toast for error */}



        </CardContent>


        <CardFooter className="flex justify-end gap-3 p-4 border-t">
          <Button variant="outline" onClick={resetFields}>
            Cancel
          </Button>
          <Button onClick={createQuestionHandler}>Add Question</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddQuestionForm;
