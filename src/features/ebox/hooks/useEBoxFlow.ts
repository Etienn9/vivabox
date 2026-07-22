"use client"

import { useState } from "react"

export type EBoxStep =
  | "intro"
  | "box"
  | "opening"
  | "message"
  | "cta"

export function useEBoxFlow() {

  const [step, setStep] = useState<EBoxStep>("intro")

  function next() {
    setStep((prev) => {
      switch (prev) {
        case "intro":
          return "box"
        case "box":
          return "opening"
        case "opening":
          return "message"
        case "message":
          return "cta"
        default:
          return prev
      }
    })
  }

  return {
    step,
    next,
    setStep,
  }
}