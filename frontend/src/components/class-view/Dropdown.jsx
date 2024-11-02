import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function CreateDropdown() {
  const { pathname } = useLocation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-36">
          Create
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuItem asChild>
          <Link 
            className="w-full cursor-pointer"
            to={`${pathname}/create-assignment`}
          >
            Assignment
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link 
            className="w-full cursor-pointer"
            to={`${pathname}/create-mcq`}
          >
            MCQ Quiz
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}