"use client"

import { useReducer, useCallback } from "react"

export type FlowStep =
  | "idle"
  | "intake"
  | "assessment"
  | "job_search"
  | "interview_prep"
  | "accommodation_request"
  | "interview_confirmed"
  | "placed"

export type FlowEvent =
  | { type: "BEGIN" }
  | { type: "COMPLETE_INTAKE"; name: string; email: string }
  | { type: "COMPLETE_ASSESSMENT" }
  | { type: "APPLY_TO_JOB"; jobTitle: string; employer: string }
  | { type: "REQUEST_ACCOMMODATIONS" }
  | { type: "CONFIRM_ACCOMMODATIONS"; accommodations: string[] }
  | { type: "INTERVIEW_PLACED" }
  | { type: "RESET" }

export interface FlowState {
  step: FlowStep
  profile: { name: string; email: string } | null
  activeJob: { title: string; employer: string } | null
  accommodations: string[]
  history: FlowStep[]
}

const initialState: FlowState = {
  step: "idle",
  profile: null,
  activeJob: null,
  accommodations: [],
  history: [],
}

function reducer(state: FlowState, event: FlowEvent): FlowState {
  switch (event.type) {
    case "BEGIN":
      return { ...state, step: "intake", history: [...state.history, state.step] }
    case "COMPLETE_INTAKE":
      return {
        ...state,
        step: "assessment",
        profile: { name: event.name, email: event.email },
        history: [...state.history, state.step],
      }
    case "COMPLETE_ASSESSMENT":
      return { ...state, step: "job_search", history: [...state.history, state.step] }
    case "APPLY_TO_JOB":
      return {
        ...state,
        step: "interview_prep",
        activeJob: { title: event.jobTitle, employer: event.employer },
        history: [...state.history, state.step],
      }
    case "REQUEST_ACCOMMODATIONS":
      return { ...state, step: "accommodation_request", history: [...state.history, state.step] }
    case "CONFIRM_ACCOMMODATIONS":
      return {
        ...state,
        step: "interview_confirmed",
        accommodations: event.accommodations,
        history: [...state.history, state.step],
      }
    case "INTERVIEW_PLACED":
      return { ...state, step: "placed", history: [...state.history, state.step] }
    case "RESET":
      return initialState
    default:
      return state
  }
}

export function useJobFlow() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const send = useCallback((event: FlowEvent) => {
    dispatch(event)
  }, [])

  return { state, send }
}
