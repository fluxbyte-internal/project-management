import { cn } from "@/lib/utils";
import React from "react";

function FormLabel(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("font-medium text-base text-gray-8", props.className)}
      {...props}
    >
      {props.children}
    </label>
  );
}
export default FormLabel;
