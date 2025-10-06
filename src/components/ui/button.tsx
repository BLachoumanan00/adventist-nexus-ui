import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.96] touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground rounded-2xl shadow-sm hover:shadow-md hover:bg-primary/95",
        destructive:
          "bg-destructive text-destructive-foreground rounded-2xl shadow-sm hover:shadow-md hover:bg-destructive/90",
        outline:
          "border border-border bg-card/50 backdrop-blur-sm rounded-2xl hover:bg-secondary/80 hover:text-foreground",
        secondary:
          "bg-secondary/80 backdrop-blur-sm text-secondary-foreground rounded-2xl border border-border/50 hover:bg-secondary",
        ghost: "rounded-2xl hover:bg-secondary/60 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline rounded-2xl",
      },
      size: {
        default: "h-11 px-5 py-2.5 min-h-[44px]",
        sm: "h-9 rounded-xl px-3.5 text-xs min-h-[40px]",
        lg: "h-14 rounded-2xl px-8 text-base min-h-[48px]",
        icon: "h-11 w-11 rounded-2xl min-h-[44px] min-w-[44px]",
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
