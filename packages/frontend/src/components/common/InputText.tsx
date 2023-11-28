import { cn } from "@/lib/utils";
import React from "react";

function InputText(
  props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">
) {
  return (
    <input
      type="text"
      className={cn(
        "py-1.5 px-3 rounded-md border border-gray-100 mt-2 w-full h-[46px] focus:outline-[#943B0C]",
        props.className
      )}
      {...props}
    >
      {props.children}
    </input>
  );
}

export default InputText;
