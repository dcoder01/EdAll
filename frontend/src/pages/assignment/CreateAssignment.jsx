import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { createAssignment } from "../../store/assignments";
import { fetchEnterClassDetails } from "../../store/classSlice";
import Spinner from "../../components/common/Spinner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";



const CreateAssignment = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [instructions, setInstructions] = useState("");
    const [marks, setMarks] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const classId = params.classId;
    const { loading, success, error, createdBy } = useSelector((state) => state.assignmentSlice);
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchEnterClassDetails(classId));
    }, [classId, dispatch]);

    useEffect(() => {
        if (!isAuthenticated) navigate("/auth/login");
        if (createdBy && createdBy !== user._id) navigate("/home");
    }, [createdBy, isAuthenticated]);


    const resetState=()=>{
        setFile(null);
        setTitle("");
        setInstructions("");
        setMarks("");
        
    }




    const createAssignmentHandler = (e) => {
        e.preventDefault();

        if (!title || !marks) {
            toast.error("Title and marks are required");
            return;
        }
        if (!file) {
            toast.error("Please upload an assignment file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("instructions", instructions);
        formData.append("classId", classId);
        formData.append("marks", marks);

        dispatch(createAssignment(formData)).then((data)=>{
            if (data?.payload?.success) {
                toast.success("Assignment created successfully please navigate to classwork")
            }
        })
        
        resetState();
        document.getElementById("file").value = ""; //gpt zindabaaaaad
    };

    return (
        <div className="container mx-auto py-8">
            <Card className="mx-auto max-w-4xl">
                <CardHeader>
                    <CardTitle>Create Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={createAssignmentHandler}
                        id="assignmentForm"
                        encType="multipart/form-data"
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Enter assignment title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="instructions" className="text-sm font-medium text-gray-700">
                                Instructions (optional)
                            </label>
                            <Textarea
                                id="instructions"
                                placeholder="Enter instructions for the assignment"
                                rows="5"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="marks" className="text-sm font-medium text-gray-700">
                                Marks
                            </label>
                            <Input
                                id="marks"
                                type="number"
                                placeholder="Enter total marks"
                                value={marks}
                                min={0}
                                onChange={(e) => setMarks(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="file" className="text-sm font-medium text-gray-700">
                                Upload File (Required)
                            </label>
                            <Input
                                id="file"
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            {file && <p className="text-sm text-gray-600">Selected file: {file.name}</p>}
                        </div>

                        <div className="flex flex-col items-center space-y-4">
                            <Button type="submit" className="w-full hover:bg-slate-700">
                                {loading ? <Spinner /> : "Create Assignment"}
                            </Button>


                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateAssignment;
