import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"; // ShadCN Card components
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Link } from "react-router-dom";
import ClassSVG from "../../assets/svg/class.svg";

export default function ClassCard({
  classTitle,
  classRoom,
  classCode,
  instructorName,
}) {
  return (
    <Card className="w-full m-4 shadow-lg">
      <CardHeader className="flex items-center justify-center p-4">
        <img src={ClassSVG} alt="Class illustration" className="w-full object-contain" />
      </CardHeader>

      <CardContent className="p-4">
        <div style={{ fontFamily: ["Sen", "sans-serif"] }}>
          <h1 className="text-lg font-semibold text-gray-900">{classTitle}</h1>
          <p className="text-gray-800">{classRoom}</p>
          <p className="text-gray-800">{instructorName}</p>
          <p className="text-xs mt-2 text-gray-700">Code: {classCode}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4">
        <Link to={`/enter/class/${classCode}`} className="w-full">
          <Button  size="lg" className="w-full">
            Enter Class
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
