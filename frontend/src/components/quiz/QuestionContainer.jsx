import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuestionContainer({
  questionBody,
  options,
  correctOption,
  correctMarks,
  incorrectMarks,
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full px-4 mb-2">
      <div className="w-full max-w-2xl p-2 mx-auto bg-white rounded-lg">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full"
        >
          <CollapsibleTrigger className="flex w-full px-4 py-2 text-sm font-medium text-left rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 data-[state=open]:bg-slate-100">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="font-bold">Question:</span>
                <span className="text-base font-normal">
                  {questionBody}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="px-4 pt-4 pb-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <div className="space-y-2">
                <h4 className="font-bold">Options:</h4>
                {options.length > 0 &&
                  options.map((option) => (
                    <p key={option.optionNumber} className="ml-2">
                      {option.optionNumber}. {option.option}
                    </p>
                  ))}
                <p className="font-bold mt-4">
                  Correct Option:{" "}
                  <span className="text-green-600">
                    {options[correctOption - 1].optionNumber}.{" "}
                    {options[correctOption - 1].option}
                  </span>
                </p>
              </div>
              
              <div className="flex items-start gap-2 font-medium">
                <span className="text-lg text-green-600">+{correctMarks}</span>
                <span className="text-lg text-slate-600">/</span>
                <span className="text-lg text-red-600">{incorrectMarks}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}