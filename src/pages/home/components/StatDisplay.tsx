// import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

// Helper component for individual stat display
type StatDisplayProps = {
  icon: ReactNode;
  label: string;
  value: number;
};

export function StatDisplayEnergy({ icon, label, value }: StatDisplayProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="w-6 h-6">{icon}</div>
          <progress value={value} max="100" className="progress progress-success"/>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {label}: {value} / 100
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
export function StatDisplayHappy({ icon, label, value }: StatDisplayProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="w-6 h-6">{icon}</div>
          <progress value={value} max="100" className="progress progress-secondary" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {label}: {value} / 100
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
export function StatDisplayHungger({ icon, label, value }: StatDisplayProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="w-6 h-6">{icon}</div>
          <progress value={value} max="100" className="progress progress-warning h-2" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {label}: {value} / 100
        </p>
      </TooltipContent>
    </Tooltip>
  );
}