import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizBanner from "./QuizBanner";
import AssignmentBanner from "./AssignmentBanner";
import VoidSVG from "../../assets/svg/void.svg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const TabComponent = ({ categories, user, createdBy }) => {

//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const initialTab = queryParams.get("tab") || "Quizzes";

//   const handleTabChange = (tab) => {
//     // Update the URL query parameter when the tab changes
//     navigate(`?tab=${tab}`, { replace: true });
//   };
return (
    <div className="w-full px-2 py-16 sm:px-0">
     <Tabs defaultValue="Quizzes">
        <TabsList className="space-x-1 rounded-xl p-1 grid w-full grid-cols-2 bg-gray-300">
          {Object.keys(categories).map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(categories).map(([category, items]) => (
          <TabsContent key={category} value={category} className="mt-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center">
                <img src={VoidSVG} alt="No tasks" className="w-40 mx-auto" />
                <h3 className="my-6 text-sm text-gray-600">Hooray, no pending tasks</h3>
              </div>
            ) : (
              items.map((item) => (
                <div className="flex flex-col items-center" key={item._id}>
                  {category === "Quizzes" ? (
                    <QuizBanner
                      questions={item.questions}
                      quizId={item._id}
                      user={user}
                      createdBy={createdBy}
                      title={item.title}
                      time={item.createdAt}
                    />
                  ) : (
                    <AssignmentBanner
                      title={item.title}
                      marks={item.marks}
                      assignmentId={item._id}
                      time={item.createdAt}
                      createdBy={createdBy}
                      user={user}
                    />
                  )}
                </div>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
export default TabComponent;