import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "../ui/button";
import show from "../../assets/eye-alt.svg";
import hide from "../../assets/eye-slash.svg";
function InputPassword({
  className,
  children,
  ...otherProps
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative mt-1">
      <input
        type={`${showPassword ? "text" : "password"}`}
        className={cn(
          "py-1.5 px-3 rounded-md border border-gray-100 w-full h-[46px] focus:outline-[#943B0C]",
          className
        )}
        {...otherProps}
      >
        {children}
      </input>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="absolute top-1/2 right-1 -translate-y-1/2 mt-[1px]"
        onClick={() => setShowPassword((old) => !old)}
      >
        <img src={showPassword ? show : hide} width={16} height={16} />
      </Button>
    </div>
  );
}

export default InputPassword;
