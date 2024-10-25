import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast"
import { Loader, X } from "lucide-react";
import { createClass } from "../../store/classSlice";
import { toast as ractToast} from 'react-toastify';

export default function CreateClassForm({ showCreateClass, setShowCreateClass }) {
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [room, setRoom] = useState("");
  const { loading, error } = useSelector((state) => state.class);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const handleClose = () => {
    setClassName(""); 
    setSubject(""); 
    setRoom(""); 
    setShowCreateClass(false); // Close the modal
  };

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
        ractToast.success("Class created successfully! Share the class code for students to join.")
        //no green color on shadcn -->pretty bad
        handleClose();
      } else {
        dispatch(fetchClasses()); //after error the cards were not showing
        toast({
          title: "Error",
          description: data?.payload || "Failed to create class.",
          variant: "destructive", // Red variant for error
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
          <Button onClick={onCreateHandler} disabled={loading} className="relative">
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
