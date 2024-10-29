import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAllUsers } from '../../store/classUser';
import Banner from "../../components/common/Banner";

const ViewPeople = () => {
    const dispatch = useDispatch();
    const { classId } = useParams();
    const navigate = useNavigate();

    const { isAuthenticated } = useSelector((state) => state.auth);
    const { loading, error, userInClass, createdBy } = useSelector((state) => state.classUserSlice);
    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/auth/login");
        } else {
            dispatch(fetchAllUsers(classId));
        }
       
    }, [ classId, dispatch, navigate]);
    
   const classUsers = userInClass.filter((user) => user._id !== createdBy._id);
    return (
        <div>

            <Banner
                // SVGComponent
                heading="People"
                bannerBackground="greencheese"
            />
            {loading ? (
                <div className="w-4/5 mx-auto">
                    <Skeleton className="w-full h-16" />
                </div>
            ) : error ? (
                <div className="w-4/5 mx-auto">
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            ) : (
                <div className="space-y-4 w-4/5 mx-auto">
                    {createdBy && (
                        <Card className="shadow-md p-4 bg-background rounded-lg sm:w-full">
                            <CardContent className="flex items-center">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <img
                                        alt="user-profile-img"
                                        className="object-cover w-full h-full"
                                        src={createdBy.picture}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="font-semibold text-lg text-primary">
                                        {createdBy.name}
                                    </h1>
                                    <span className="text-sm text-muted-foreground">
                                        {createdBy.email}
                                    </span>
                                </div>
                                <span className="ml-auto text-sm text-muted-foreground">
                                    Teacher
                                </span>
                            </CardContent>
                        </Card>
                    )}
                    
                    {classUsers && classUsers.map((user, index) => (
                        <Card key={index} className="shadow-md p-4 bg-background rounded-lg sm:w-full">
                            <CardContent className="flex items-center">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <img
                                        alt="user-profile-img"
                                        className="object-cover w-full h-full"
                                        src={user.picture}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="font-semibold text-lg text-primary">
                                        {user.name}
                                    </h1>
                                    <span className="text-sm text-muted-foreground">
                                        {user.email}
                                    </span>
                                </div>
                                <span className="ml-auto text-sm text-muted-foreground">
                                    Student
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewPeople;
