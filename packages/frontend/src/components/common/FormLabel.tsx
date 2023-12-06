import { cn } from "@/lib/utils";
import React from "react";

function FormLabel({
  className,
  children,
  ...otherProps
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("font-medium text-base text-gray-8", className)}
      {...otherProps}
    >
      {children}
    </label>
  );
}
export default FormLabel;
