import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        none: "",
        default:
          "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        destructive:
          "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
const Button = ({
  className,
  variant,
  size,
  children,
  isLoading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  }) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }), {
        "relative pointer-events-none": isLoading,
      })}
      {...props}
    >
      {children}
      {isLoading && (
        <div className="absolute w-full h-full grid place-content-center backdrop-blur-[1px] bg-[#00000036]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 38 38"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                x1="8.042%"
                y1="0%"
                x2="65.682%"
                y2="23.865%"
                id="a"
              >
                <stop stop-color="#fff" stop-opacity="0" offset="0%" />
                <stop stop-color="#fff" stop-opacity=".631" offset="63.146%" />
                <stop stop-color="#fff" offset="100%" />
              </linearGradient>
            </defs>
            <g fill="none" fill-rule="evenodd">
              <g transform="translate(1 1)">
                <path
                  d="M36 18c0-9.94-8.06-18-18-18"
                  id="Oval-2"
                  stroke="url(#a)"
                  stroke-width="2"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                </path>
                <circle fill="#fff" cx="36" cy="18" r="1">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            </g>
          </svg>
        </div>
      )}
    </button>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
