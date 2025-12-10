import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/lib/button-variants"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  label?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      label,
      icon,
      iconPosition = "left",
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "relative")}
        ref={ref}
        {...props}
        disabled={props.disabled || loading}
      >
        {loading ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="flex items-center">{icon}</span>
            )}

            {label || children}

            {icon && iconPosition === "right" && (
              <span className="flex items-center">{icon}</span>
            )}
          </>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button }
