import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-200 border-blue-500/40",
        secondary:
          "border-transparent bg-gradient-to-r from-gray-500/30 to-gray-600/30 text-gray-200 border-gray-500/40",
        destructive: "border-transparent bg-gradient-to-r from-red-500/30 to-red-600/30 text-red-200 border-red-500/40",
        outline: "text-white border-white/30 hover:bg-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant, ...props }, ref) => {
  return <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
})
Badge.displayName = "Badge"

export { Badge, badgeVariants }
