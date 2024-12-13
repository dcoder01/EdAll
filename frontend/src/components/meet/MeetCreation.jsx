import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



const MeetCreation = ({ currentClass, user, meetId, setMeetId, createMeetHandler, joinMeetHandler }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-lg px-4 py-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">Video Meeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              type="text"
              placeholder="Enter meet ID"
              value={meetId}
              onChange={(e) => setMeetId(e.target.value)}
              className="h-12 text-lg"
            />
            <Button
              className="w-full h-12 text-lg"
              variant="outline"
              onClick={joinMeetHandler}
            >
              Join meet
            </Button>
            {currentClass && currentClass.createdBy === user._id &&
              (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-gray-50 px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  <Button
                    className="w-full h-12 text-lg"
                    onClick={createMeetHandler}
                  >
                    Create new meet
                  </Button>
                </>
              )
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeetCreation;