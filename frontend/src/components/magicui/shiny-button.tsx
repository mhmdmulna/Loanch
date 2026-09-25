"use client"

import React from "react"
import { motion, type MotionProps } from "motion/react"
import { cn } from "@/lib/utils"

const shinyTransition = {
  repeat: Infinity,
  repeatType: "loop" as const,
  repeatDelay: 1,
  type: "spring" as const,
  stiffness: 20,
  damping: 15,
  mass: 2,
}

export interface ShinyButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof MotionProps>,
    MotionProps {
  children: React.ReactNode
  className?: string
  as?: "a" | "button"
}

export const ShinyButton = React.forwardRef<
  HTMLAnchorElement & HTMLButtonElement,
  ShinyButtonProps
>(({ children, className, as = "a", initial, animate, transition, ...props }, ref) => {
  const Component = (as === "button" ? motion.button : motion.a) as any

  const initialObj = typeof initial === "object" && initial !== null ? initial : {}
  const animateObj = typeof animate === "object" && animate !== null ? animate : {}
  const transitionObj = typeof transition === "object" && transition !== null ? transition : {}

  return (
    <Component
      ref={ref}
      className={cn(
        "relative overflow-hidden font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow",
        className
      )}
      initial={{ "--x": "100%", ...initialObj }}
      animate={{ "--x": "-100%", ...animateObj }}
      transition={{ "--x": shinyTransition, ...transitionObj }}
      {...props}
    >
      <span
        className="relative flex items-center justify-center gap-2 size-full text-inherit z-10"
        style={{
          maskImage:
            "linear-gradient(-75deg, rgba(255,255,255,1) calc(var(--x) + 20%), rgba(255,255,255,0.35) calc(var(--x) + 30%), rgba(255,255,255,1) calc(var(--x) + 100%))",
          WebkitMaskImage:
            "linear-gradient(-75deg, rgba(255,255,255,1) calc(var(--x) + 20%), rgba(255,255,255,0.35) calc(var(--x) + 30%), rgba(255,255,255,1) calc(var(--x) + 100%))",
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
        className="absolute inset-0 z-20 block rounded-[inherit] bg-[linear-gradient(-75deg,rgba(255,255,255,0.1)_calc(var(--x)+20%),rgba(255,255,255,0.7)_calc(var(--x)+25%),rgba(255,255,255,0.1)_calc(var(--x)+100%))] p-px pointer-events-none"
      />
    </Component>
  )
})

ShinyButton.displayName = "ShinyButton"
