"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

type SwitchSize = "sm" | "md" | "lg"

const sizeClasses: Record<
  SwitchSize,
  {
    root: string
    thumb: string
    translate: string
    inner: string
  }
> = {
  sm: {
    root: "h-4 w-7",
    thumb: "h-3 w-3",
    translate: "data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0",
    inner: "h-1 w-1"
  },
  md: {
    root: "h-6 w-11",
    thumb: "h-5 w-5",
    translate: "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
    inner: "h-2 w-2"
  },
  lg: {
    root: "h-8 w-14",
    thumb: "h-7 w-7",
    translate: "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0",
    inner: "h-3 w-3"
  }
}

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  size?: SwitchSize
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size = "md", ...props }, ref) => {
  const { root, thumb, translate, inner } = sizeClasses[size] || sizeClasses.md
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        root,
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform flex items-center justify-center group",
          thumb,
          translate
        )}
      >
        <span
          className={cn(
            "block rounded-full transition-colors",
            inner,
            "bg-gray-300 group-data-[state=checked]:bg-primary"
          )}
          data-slot="switch-inner"
        />
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }