import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { createAnnouncement } from '../../store/announcement';
import { useParams } from 'react-router';
import { useToast } from "@/hooks/use-toast"
import { toast as ReactToast } from 'react-toastify';


const Announcement = () => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const params = useParams();
  const classId = params.classId;
  // console.log(classId);
  const { loading, error, success } = useSelector(
    (state) => state.announcementSlice
  );

  const makeNewAnnouncement = () => {
    if (!content.trim()) return;
    setContent(""); // Clear content 
    dispatch(createAnnouncement({classId, content})).then((data)=>{
      if (data?.payload?.success) {
        ReactToast.success("Announcement created!");
        
      } else {
        toast({
          title: data?.payload || "Could not create announcement",
         
        })
     
      }
    }); 
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>New Announcement</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          className="min-h-[100px]"
          placeholder="Announce something to your class"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <Button 
            onClick={makeNewAnnouncement} 
            disabled={loading || !content.trim()}
            className="w-24"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting
              </>
            ) : (
              'Post'
            )}
          </Button>
          <span className="text-sm text-gray-500">
            {content.length} characters
          </span>
        </div>
        
        {/* {error && (
          <Alert variant="destructive" className="w-full">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="w-full">
            <AlertDescription>Announcement posted successfully!</AlertDescription>
          </Alert>
        )} */}
      </CardFooter>
    </Card>
  );
};

export default Announcement;