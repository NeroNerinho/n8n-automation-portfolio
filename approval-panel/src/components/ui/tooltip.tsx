import * as React from "react"
import { cn } from "@/lib/utils"

export interface TooltipProps {
    children: React.ReactNode
    delayDuration?: number
}

export interface TooltipContentProps {
    children: React.ReactNode
    side?: "top" | "right" | "bottom" | "left"
    className?: string
}

export interface TooltipTriggerProps {
    asChild?: boolean
    children: React.ReactNode
}

export const TooltipProvider: React.FC<TooltipProps> = ({ children }) => {
    return <>{children}</>
}

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
    const [open, setOpen] = React.useState(false)

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, { open })
                }
                return child
            })}
        </div>
    )
}

export const TooltipTrigger = React.forwardRef<HTMLDivElement, TooltipTriggerProps>(
    ({ asChild, children, ...props }, ref) => {
        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children as React.ReactElement<any>, { ref, ...props })
        }
        return <div ref={ref} {...props}>{children}</div>
    }
)
TooltipTrigger.displayName = "TooltipTrigger"

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps & { open?: boolean }>(
    ({ children, side = "top", className, open, ...props }, ref) => {
        if (!open) return null

        const sideClasses = {
            top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
            right: "left-full top-1/2 -translate-y-1/2 ml-2",
            bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
            left: "right-full top-1/2 -translate-y-1/2 mr-2"
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "absolute z-50 px-3 py-1.5 text-sm bg-popover text-popover-foreground rounded-md border shadow-md",
                    sideClasses[side],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
TooltipContent.displayName = "TooltipContent"
