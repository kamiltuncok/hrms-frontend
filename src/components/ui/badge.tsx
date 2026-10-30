import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#7d92ff]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#eb5fa6] text-[#161016]",
        secondary:
          "border-transparent bg-[rgba(125,146,255,0.15)] text-[#a6b4ff]",
        outline:
          "border-[rgba(245,246,248,0.15)] bg-transparent text-[#f5f6f8]",
        destructive:
          "border-transparent bg-destructive/20 text-destructive-foreground",
        lavender:
          "border-transparent bg-[rgba(125,146,255,0.15)] text-[#a6b4ff]",
        pink:
          "border-transparent bg-[rgba(235,95,166,0.15)] text-[#eb5fa6]",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
