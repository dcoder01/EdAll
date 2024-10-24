import React from "react";
import { Card, CardMedia, CardContent, CardActions } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import ClassSVG from "../../assets/svg/class.svg";

export default function ClassCard({
  classTitle,
  classRoom,
  classCode,
  instructorName,
}) {
  return (
    <Card sx={{ margin: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <CardMedia
        component="img"
        image={ClassSVG}
        title="Card Image"
        className="bg-white h-48 object-contain p-4"
      />
      
      <CardContent>
        <div
          style={{
            fontFamily: ["Sen", "sans-serif"],
          }}
        >
          <h1 className="text-lg font-semibold text-gray-900">
            {classTitle}
          </h1>
          <p className="text-gray-800">
            {classRoom}
          </p>
          <p className="text-gray-800">
            {instructorName}
          </p>
          <p className="text-xs mt-2 text-gray-700">
            Code: {classCode}
          </p>
        </div>
      </CardContent>

      <CardActions className="p-4">
        <Link to={`/enter/class/${classCode}`} style={{ width: '100%' }}>
          <Button 
            variant="contained" 
            color="success" 
            size="medium"
            fullWidth
            className="py-2"
          >
            Enter class
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}