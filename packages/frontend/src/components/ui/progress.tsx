import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <div>
    {/* <div
      className=" w-[50px] h-[30px] relative bottom-2 bg-primary-500 items-center flex justify-center text-white rounded-md"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    >
      {value ? value : 0}%
      <div
        className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 border-solid border-t  w-0 h-0 border-t-primary-500 border-x-transparent"
        style={{ borderWidth: "8px 8px 0" }}
      />
    </div> */}

    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary-300 transition-all dark:bg-slate-50 "
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
