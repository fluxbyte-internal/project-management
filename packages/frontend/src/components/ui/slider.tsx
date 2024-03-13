import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <div>
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center group",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <SliderPrimitive.Range
          className={`absolute h-full ${
            props.disabled ? "bg-primary-200" : "bg-primary-400"
          } dark:bg-slate-50`}
        />
      </SliderPrimitive.Track>
      <TooltipProvider delayDuration={0}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <SliderPrimitive.Thumb
              className={`${
                props.disabled ? "opacity-0" : ""
              } block h-5 w-5 rounded-full border-2 border-primary-300 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-50 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300`}
            />
          </TooltipTrigger>
          <TooltipContent>{props.defaultValue ?? 0}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SliderPrimitive.Root>
  </div>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
