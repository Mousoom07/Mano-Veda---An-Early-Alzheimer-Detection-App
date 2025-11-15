import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border border-white/20 bg-gray-900/60 px-4 py-3 text-base text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all duration-300",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
