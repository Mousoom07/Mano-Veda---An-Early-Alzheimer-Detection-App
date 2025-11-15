import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-white/10 bg-gray-800/50 px-4 py-3 text-base text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all duration-300 resize-none",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
