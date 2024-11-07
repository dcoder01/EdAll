import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AddQuestionForm = ({ showAddQuestion, setShowAddQuestion, setQuestions, setTotalMarks }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState(-1);
  const [correctMarks, setCorrectMarks] = useState(1);
  const [incorrectMarks, setIncorrectMarks] = useState(0);
  const { toast } = useToast();

  const resetFields = () => {
    setQuestion("");
    setOptions([]);
    setCorrectOption(-1);
    setCorrectMarks(1);
    setIncorrectMarks(0);
  };

  const addOption = () => {
    setOptions([...options, { option: "", isCorrect: false }]);
  };

  const handleCreateQuestion = () => {
    if (!question || options.length === 0 || correctOption === -1) {
      toast({ title: "Error", description: "One or more fields are invalid", variant: "destructive" });
      return;
    }
    setQuestions((prev) => [...prev, { question, options, correctOption, correctMarks, incorrectMarks }]);
    setTotalMarks((marks) => marks + correctMarks);
    resetFields();
    setShowAddQuestion(false);
  };

  return (
    <Card active={showAddQuestion} size="lg">
      <CardHeader title="Add Question" subtitle="Enter the question, add options, and mark the correct option." />
      <CardContent>
        <Input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question text"
        />
        <div className="mt-4">
          {options.map((opt, index) => (
            <div key={index} className="flex space-x-2">
              <Input type="text" placeholder={`Option ${index + 1}`} />
              <Button onClick={() => setCorrectOption(index)}>Mark as Correct</Button>
            </div>
          ))}
          <Button onClick={addOption}>Add Option</Button>
        </div>
        <div className="flex space-x-4 mt-4">
          <Input type="number" value={correctMarks} onChange={(e) => setCorrectMarks(e.target.value)} placeholder="Marks for correct answer" />
          <Input type="number" value={incorrectMarks} onChange={(e) => setIncorrectMarks(e.target.value)} placeholder="Marks for incorrect answer" />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreateQuestion}>Create Question</Button>
        <Button variant="destructive" onClick={() => setShowAddQuestion(false)}>Cancel</Button>
      </CardFooter>
    </Card>
  );
};

export default AddQuestionForm;
