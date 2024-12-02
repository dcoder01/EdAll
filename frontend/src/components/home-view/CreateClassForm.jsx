// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { X } from "lucide-react";

// const Option = ({ optionDesc, optionNumber }) => {
//   return (
//     <div className="flex items-center gap-2 mb-2">
//       <input
//         type="radio"
//         name="correctOption"
//         value={optionNumber}
//         className="w-4 h-4 text-blue-600"
//       />
//       <label className="flex-1">
//         {optionNumber}. {optionDesc}
//       </label>
//     </div>
//   );
// };

// export default function AddQuestionForm({
//   showAddQuestion,
//   setShowAddQuestion,
//   setQuestions,
//   setTotalMarks,
// }) {
//   const [question, setQuestion] = useState("");
//   const [options, setOptions] = useState([]);
//   const [optionNumber, setOptionNumber] = useState(1);
//   const [correctOption, setCorrectOption] = useState(-1);
//   const [error, setError] = useState("");
//   const [correctMarks, setCorrectMarks] = useState(1);
//   const [incorrectMarks, setIncorrectMarks] = useState(0);
//   const [optionDesc, setOptionDesc] = useState("");

//   const resetFields = () => {
//     setQuestion("");
//     setOptions([]);
//     setOptionNumber(1);
//     setOptionDesc("");
//     setCorrectOption(-1);
//     setCorrectMarks(1);
//     setIncorrectMarks(0);
//     setError("");
//     setShowAddQuestion(false);
//   };

//   const createQuestionHandler = () => {
//     if (!question || options.length === 0 || correctOption === -1) {
//       setError("One or more fields are invalid.");
//       return;
//     }
//     const questionBody = {
//       question,
//       options,
//       correctOption,
//       correctMarks,
//       incorrectMarks,
//     };
//     setQuestions((prevQuestions) => [...prevQuestions, questionBody]);
//     setTotalMarks((totalMarks) => totalMarks + correctMarks);
//     resetFields();
//   };

//   const addOptionsHandler = (e) => {
//     e.preventDefault();
//     if (!optionDesc.trim()) return;

//     const currentOption = {
//       option: optionDesc,
//       optionNumber: optionNumber,
//     };
//     setOptions((options) => [...options, currentOption]);
//     setOptionNumber(optionNumber + 1);
//     setOptionDesc("");
//   };

//   if (!showAddQuestion) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <Card className="w-full max-w-2xl bg-white">
//         <CardHeader className="flex flex-row items-center justify-between border-b p-4">
//           <div>
//             <h2 className="text-xl font-semibold">Add Question</h2>
//             <p className="text-sm text-gray-500">
//               Enter the question, add options, select the correct option.
//             </p>
//           </div>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={resetFields}
//             className="h-8 w-8 rounded-full"
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </CardHeader>

//         <CardContent className="p-4 space-y-4">
//           <div className="space-y-2">
//             <label className="block text-sm font-medium">Question</label>
//             <Textarea
//               placeholder="Question body goes here"
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               className="min-h-[100px]"
//             />
//           </div>

//           <div className="space-y-2">
//             {options.length > 0 && (
//               <div className="mb-4" onChange={(e) => setCorrectOption(parseInt(e.target.value))}>
//                 {options.map((option) => (
//                   <Option
//                     key={option.optionNumber}
//                     optionDesc={option.option}
//                     optionNumber={option.optionNumber}
//                   />
//                 ))}
//               </div>
//             )}

//             <div className="flex gap-2">
//               <Input
//                 placeholder="Option description"
//                 value={optionDesc}
//                 onChange={(e) => setOptionDesc(e.target.value)}
//                 className="flex-1"
//               />
//               <Button onClick={addOptionsHandler}>
//                 Add option
//               </Button>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="block text-sm font-medium">
//                 Marks for correct answer
//               </label>
//               <Input
//                 type="number"
//                 min="1"
//                 value={correctMarks}
//                 onChange={(e) => setCorrectMarks(parseInt(e.target.value))}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium">
//                 Marks for incorrect answer
//               </label>
//               <Input
//                 type="number"
//                 max="0"
//                 value={incorrectMarks}
//                 onChange={(e) => setIncorrectMarks(parseInt(e.target.value))}
//               />
//             </div>
//           </div>

//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
//         </CardContent>

//         <CardFooter className="flex justify-end gap-3 p-4 border-t">
//           <Button variant="outline" onClick={resetFields}>
//             Cancel
//           </Button>
//           <Button onClick={createQuestionHandler}>
//             Create question
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }









import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader, X } from "lucide-react";
import { createClass, fetchClasses } from "../../store/classSlice"; // Ensure fetchClasses is imported
import { toast as reactToast } from "react-toastify";

export default function CreateClassForm({ showCreateClass, setShowCreateClass }) {
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [room, setRoom] = useState("");
  const { loading } = useSelector((state) => state.class); // Error removed as it's not destructured
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Close modal handler
  const handleClose = () => {
    setClassName("");
    setSubject("");
    setRoom("");
    setShowCreateClass(false);
  };

  // Create class handler
  const onCreateHandler = () => {
    if (!className || !subject || !room) {
      toast({
        title: "Error",
        description: "One or more fields are invalid",
        variant: "destructive",
      });
      return;
    }
    dispatch(createClass({ className, subject, room })).then((data) => {
      if (data?.payload?.success) {
        reactToast.success(
          "Class created successfully! Share the class code for students to join."
        );
        handleClose();
      } else {
        dispatch(fetchClasses()); // Ensures classes are re-fetched after an error
        toast({
          title: "Error",
          description: data?.payload || "Failed to create class.",
          variant: "destructive",
        });
      }
    });
  };

  if (!showCreateClass) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">Create Class</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Class Name</label>
            <Input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter class name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Subject</label>
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Room</label>
            <Input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Enter room"
              className="w-full"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3 p-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={onCreateHandler}
            disabled={loading}
            className="relative"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Creating...
              </div>
            ) : (
              "Create"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
