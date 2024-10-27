import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAnnouncement } from "../../store/announcement";
import Spinner from "../common/Spinner";
import { Button } from "@/components/ui/button"; 
import { Avatar } from "@/components/ui/avatar"; 
import { Loader, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import { toast as ReactToast } from 'react-toastify';
const UserAnnouncement = ({
  picture,
  name,
  time,
  content,
  userId,
  announcementMadeBy,
  announcementId,
  classId,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.announcementSlice);
  const toast=useToast()
  const deleteAnnouncementHandler = () => {

      
    dispatch(deleteAnnouncement(announcementId)).then((data)=>{
      if (data?.payload?.success) {
        ReactToast.success("Announcement deleted!");
        
      } else {
        toast({
          title: data?.payload || "Deletion failed",
         
        })
     
      }
    });
  };

  return (
    <div className="flex bg-white shadow-lg rounded-lg mx-4 my-2 p-4">
      <Avatar
        className="w-12 h-12 rounded-full object-cover mr-4 shadow" 
        src={picture}
        alt="avatar"
      />
      <div className="w-full">
        <div className="flex items-center justify-between sm:flex-col sm:items-start">
          <h2 className="text-lg font-semibold text-gray-900 -mt-1">{name}</h2>
          <div className="flex justify-between items-center sm:w-full">
            <small className="text-sm text-gray-700">
              {new Date(time).toDateString()}
            </small>
            {userId === announcementMadeBy && (
              <>
                {loading ? (
                  <div className="mx-4">
                    <Spinner />
                  </div>
                ) : (
                  <Button
                  variant="ghost"
                  size="icon"
                  onClick={deleteAnnouncementHandler}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
                )}
              </>
            )}
          </div>
        </div>
        <p className="mt-3 text-gray-700 text-sm">{content}</p>
      </div>
    </div>
  );
};

export default UserAnnouncement;
