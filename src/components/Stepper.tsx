import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function Stepper({
  steps,
  activeStep,
}: {
  steps: string[];
  activeStep: number;
}) {
  return (
    <div className="w-full flex flex-1 items-center justify-between mb-6">
      {steps.map((label, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;

        return (
          <div key={index} className="flex-1 flex items-center w-full">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                isCompleted
                  ? "bg-blue-600 text-white border-blue-600"
                  : isActive
                  ? "bg-white text-blue-600 border-blue-600"
                  : "border-gray-300 text-gray-400"
              )}
            >
              {isCompleted ? <Check /> : index + 1}
            </div>
            <div className="ml-2 text-sm">{label}</div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-gray-300 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}
