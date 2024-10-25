import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast"
import { Loader, X } from "lucide-react";
import { fetchClasses, joinClass } from '../../store/classSlice';
import { toast as ractToast} from 'react-toastify';
export default function JoinClassForm({ showJoinClass, setShowJoinClass }) {
    const [classID, setclassID] = useState("");
    const { loading, success, error } = useSelector((state) => state.class);
    const dispatch = useDispatch();
    const { toast } = useToast();
    const handleClose = () => {
        setclassID(""); 
        setShowJoinClass(false); // Close the modal
    };

    const onJoinHandler = () => {
        if (!classID) {
            toast({
                title: "Error",
                description: "Class code cannot be empty",
                variant: "destructive", 
            });
            return;
        }

        dispatch(joinClass({ classId: classID })).then((data) => {
            if (data?.payload?.success) {
                ractToast.success("Joined class successfully! Happy studying")
                handleClose();
            } else {
                dispatch(fetchClasses());
                toast({
                    title: "Error",
                    description: data?.payload || "Failed to join class.",
                    variant: "destructive", 
                });
            }
        });
    };

    if (!showJoinClass) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                    <h2 className="text-xl font-semibold">Join Class</h2>
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
                        <label htmlFor="classID" className="block text-sm font-medium">
                            Class Code
                        </label>
                        <Input
                            id="classID"
                            type="text"
                            value={classID}
                            onChange={(e) => setclassID(e.target.value)}
                            placeholder="Enter class code"
                            className="w-full"
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 p-4 border-t">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onJoinHandler}
                        disabled={loading}
                        className="relative"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader className="w-4 h-4 animate-spin" />
                                Joining...
                            </div>
                        ) : (
                            'Join'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
