import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ToolTopRendererProps {
  children: React.ReactNode;
  message: string;
}
export default function ToolTipRenderer({
  children,
  message,
}: ToolTopRendererProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p className="font-mono font-semibold">{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
