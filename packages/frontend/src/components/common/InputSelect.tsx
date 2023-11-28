import { cn } from "@/lib/utils";
import Select, { Props } from "react-select";

function InputSelect<T>(props: Props<T>) {
  return (
    <Select
      className={cn(
        "rounded-md z-20 border border-gray-100 mt-2 w-full h-[46px] focus:outline-[#943B0C] [&>div]:min-h-full [&>div]:border-none [&>div]:rounded-md", // [&>div:first-of-type]:bg-transparent
        props.className
      )}
      {...props}
      menuPortalTarget={document.body}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
    />
  );
}

export default InputSelect;
