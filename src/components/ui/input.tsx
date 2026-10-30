import * as React from "react"

import { cn } from "@/shared/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[rgba(245,246,248,0.12)] bg-[#141822] px-4 py-2 text-sm text-[#f5f6f8] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[rgba(245,246,248,0.45)] focus-visible:outline-none focus-visible:border-[#7d92ff] focus-visible:ring-1 focus-visible:ring-[#7d92ff] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
