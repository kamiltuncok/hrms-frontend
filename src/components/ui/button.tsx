import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7d92ff] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#eb5fa6] text-[#161016] hover:bg-[#f074b4] shadow-sm hover:shadow-[0_4px_18px_rgba(235,95,166,0.35)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline:
          "border border-[rgba(245,246,248,0.18)] bg-transparent text-[#f5f6f8] hover:bg-white/5 hover:border-[rgba(245,246,248,0.35)]",
        secondary:
          "bg-[rgba(245,246,248,0.08)] text-[#f5f6f8] border border-[rgba(245,246,248,0.12)] hover:bg-[rgba(245,246,248,0.14)]",
        ghost: "text-[#f5f6f8] hover:text-[#ffffff] hover:bg-white/5",
        link: "text-[#7d92ff] underline-offset-4 hover:underline hover:text-[#a6b4ff]",
        brandPink: "bg-[#eb5fa6] text-[#161016] hover:bg-[#f074b4] font-bold shadow-[0_4px_20px_rgba(235,95,166,0.25)]",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
