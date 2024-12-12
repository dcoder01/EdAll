import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchEnterClassDetails } from "../../store/classSlice";
import { fetchAnnouncements } from "../../store/announcement";
import { fetchPendingTasks } from "../../store/pendingTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";
import Banner from "../../components/common/Banner";
import BannerSVG from "../../assets/svg/online_class.svg";
import UserAnnouncement from "../../components/class-view/UserAnnouncement"; 
import Announcement from "../../components/class-view/Announcement"; 
import AnnouncementSVG from '../../assets/svg/announcement.svg'


const EnterClass = () => {
  const { classId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const { loading: announcementsLoading, error: announcementsError, announcements } =
    useSelector((state) => state.announcementSlice);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { currentClass, loading: classLoading } = useSelector((state) => state.class);
  const { quizzes, assignments, loading: tasksLoading, error: tasksError } =
    useSelector((state) => state.pendingSlice);
  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/auth/login");
    }
    dispatch(fetchEnterClassDetails(classId));
    dispatch(fetchAnnouncements(classId));
  }, [classId, isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    if (currentClass?.createdBy && currentClass.createdBy !== user.id) {
      dispatch(fetchPendingTasks(classId));
    }
  }, [currentClass, user, classId, dispatch]);

  // const joinMeetScreen = () => {
  //   if (roomId) navigate(`/join/meet?roomId=${roomId}`);
  // };

  const createMeetScreen = () => {
    navigate("/join/meet");
  };

  if (classLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner
        bannerBackground="tornado"
        SVGComponent={BannerSVG}
        heading={currentClass?.className || "Loading..."}
        customText={currentClass?.subject && currentClass?.room ? `${currentClass.subject}, Room ${currentClass.room}` : "Loading..."}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Meeting Card */}
          <Card>
            <CardHeader>
              <CardTitle>Live class</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <Input
                placeholder="Enter meet ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <Button
                className="w-full"
                variant="outline"
                onClick={joinMeetScreen}
              >
                Join meet
              </Button> */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                {/* <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div> */}
              </div>
              <Button
                className="w-full"
                onClick={createMeetScreen}
              >
                Create or Join meet
              </Button>
            </CardContent>
          </Card>

          {/* Pending Tasks Card */}
          {currentClass?.createdBy && currentClass.createdBy !== user._id && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader className="w-6 h-6 animate-spin" />
                  </div>
                ) : tasksError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{tasksError}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    {quizzes?.map((quiz) => (
                      <Link
                        key={quiz._id}
                        to={`/enter/class/${classId}/classwork/quiz/${quiz._id}`}
                        className="block text-blue-600 hover:underline"
                      >
                        {quiz.title}
                      </Link>
                    ))}
                    {assignments?.map((assignment) => (
                      <Link
                        key={assignment._id}
                        to={`/enter/class/${classId}/classwork/assignment/${assignment._id}`}
                        className="block text-blue-600 hover:underline"
                      >
                        {assignment.title}
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg w-full">
            {isAuthenticated && (
              <div className="p-4 border-b">
                <Announcement />
              </div>
            )}

            <div className="flex flex-col">
              {announcementsLoading ? (
                <div className="flex justify-center p-6">
                  <Loader className="w-6 h-6 animate-spin" />
                </div>
              ) : announcementsError ? (
                <div className="p-4">
                  <Alert variant="destructive">
                    <AlertDescription>{announcementsError}</AlertDescription>
                  </Alert>
                </div>
              ) : announcements?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                  <div className="w-60 h-60 flex items-center justify-center">
                    <img 
                      src={AnnouncementSVG} 
                      alt="No announcements" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-500 font-poppins">
                    Announce something to your class
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  
                  
                  {announcements?.map((announcement) => (

                   
                  
                    <UserAnnouncement
                    
                      key={announcement._id}
                      announcementId={announcement._id}
                      userId={user._id}
                      announcementMadeBy={announcement.user._id}
                      name={announcement.user.name}
                      picture={announcement.user.picture}
                      content={announcement.content}
                      time={announcement.createdAt}
                      classId={classId}
                    />
                  
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EnterClass;
