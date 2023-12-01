import { cn } from "@/lib/utils";

function ErrorMessage({
  className,
  children,
  ...otherProps
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-sm text-red-400 mt-2.5 pl-1.5", className)}
      {...otherProps}
    >
      {children}
    </span>
  );
}

export default ErrorMessage;
