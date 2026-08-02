"use client"

import { useState } from "react"
import { useJobFlow, type FlowStep } from "@/hooks/use-job-flow"
import { InterviewAccommodations } from "@/components/interview-accommodations"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  UserCheck,
  FileSpreadsheet,
  Search,
  CalendarCheck,
  BookCheck,
  PartyPopper,
  ArrowRight,
  RotateCcw,
} from "lucide-react"

const STEP_META: Record<FlowStep, { label: string; icon: React.ReactNode }> = {
  idle: { label: "Start", icon: <UserCheck className="h-4 w-4" /> },
  intake: { label: "Intake", icon: <UserCheck className="h-4 w-4" /> },
  assessment: { label: "Assessment", icon: <FileSpreadsheet className="h-4 w-4" /> },
  job_search: { label: "Job Search", icon: <Search className="h-4 w-4" /> },
  interview_prep: { label: "Interview Prep", icon: <CalendarCheck className="h-4 w-4" /> },
  accommodation_request: { label: "Accommodations", icon: <BookCheck className="h-4 w-4" /> },
  interview_confirmed: { label: "Confirmed", icon: <CalendarCheck className="h-4 w-4" /> },
  placed: { label: "Placed!", icon: <PartyPopper className="h-4 w-4" /> },
}

const VISIBLE_STEPS: FlowStep[] = [
  "intake",
  "assessment",
  "job_search",
  "interview_prep",
  "accommodation_request",
  "interview_confirmed",
  "placed",
]

const JOB_LISTINGS = [
  { title: "Administrative Assistant", employer: "Austin City Hall", match: 88 },
  { title: "IT Help Desk Technician", employer: "Regional Healthcare", match: 83 },
  { title: "Customer Support Specialist", employer: "Tech Solutions Inc.", match: 76 },
]

export function JobSeekerFlow() {
  const { state, send } = useJobFlow()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const stepIndex = VISIBLE_STEPS.indexOf(state.step)

  return (
    <div className="space-y-6">
      {/* Progress rail */}
      {state.step !== "idle" && (
        <nav aria-label="Journey progress" className="flex items-center gap-1 overflow-x-auto pb-1">
          {VISIBLE_STEPS.map((s, i) => {
            const active = s === state.step
            const done = i < stepIndex
            return (
              <div key={s} className="flex items-center gap-1 shrink-0">
                <span
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors
                    ${active ? "bg-primary text-primary-foreground" : done ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                >
                  {STEP_META[s].icon}
                  {STEP_META[s].label}
                </span>
                {i < VISIBLE_STEPS.length - 1 && (
                  <ArrowRight className={`h-3 w-3 shrink-0 ${done ? "text-primary/50" : "text-muted-foreground/30"}`} />
                )}
              </div>
            )
          })}
        </nav>
      )}

      {/* Step panels */}
      <Card className="border-primary/20 shadow-sm">
        {state.step === "idle" && (
          <>
            <CardHeader>
              <CardTitle>Start Your Job Journey</CardTitle>
              <CardDescription>
                Deaf-first workforce services — built with accessibility at every step.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => send({ type: "BEGIN" })} className="flex items-center gap-2">
                Begin <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </>
        )}

        {state.step === "intake" && (
          <>
            <CardHeader>
              <CardTitle>Tell us about yourself</CardTitle>
              <CardDescription>Your information is encrypted and handled under HIPAA safeguards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <Button
                onClick={() => send({ type: "COMPLETE_INTAKE", name, email })}
                disabled={!name.trim() || !email.trim()}
                className="flex items-center gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </>
        )}

        {state.step === "assessment" && (
          <>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>
                Hi {state.profile?.name} — let&apos;s match your strengths to the right opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {["Technical Skills", "Communication", "Problem Solving", "Digital Literacy"].map((skill) => (
                  <div key={skill} className="p-3 rounded-lg border bg-muted/40">
                    <span className="text-sm font-medium">{skill}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Assessment results feed directly into your personalized job matches.
              </p>
              <Button onClick={() => send({ type: "COMPLETE_ASSESSMENT" })} className="flex items-center gap-2">
                Complete Assessment <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </>
        )}

        {state.step === "job_search" && (
          <>
            <CardHeader>
              <CardTitle>Your Job Matches</CardTitle>
              <CardDescription>Roles matched to your skills. Select one to apply and prep for an interview.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {JOB_LISTINGS.map((job) => (
                <div key={job.title} className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.employer}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      {job.match}% match
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => send({ type: "APPLY_TO_JOB", jobTitle: job.title, employer: job.employer })}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </>
        )}

        {state.step === "interview_prep" && (
          <>
            <CardHeader>
              <CardTitle>Interview Preparation</CardTitle>
              <CardDescription>
                You applied for <span className="font-medium">{state.activeJob?.title}</span> at{" "}
                <span className="font-medium">{state.activeJob?.employer}</span>. Do you need accommodations for your
                interview?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => send({ type: "REQUEST_ACCOMMODATIONS" })}
                className="flex items-center gap-2"
              >
                Request Accommodations <BookCheck className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  send({
                    type: "CONFIRM_ACCOMMODATIONS",
                    accommodations: [],
                  })
                }
              >
                No accommodations needed
              </Button>
            </CardContent>
          </>
        )}

        {state.step === "accommodation_request" && state.activeJob && (
          <CardContent className="pt-6">
            <InterviewAccommodations
              jobTitle={state.activeJob.title}
              employer={state.activeJob.employer}
              onConfirm={(accommodations) => send({ type: "CONFIRM_ACCOMMODATIONS", accommodations })}
              onBack={() => send({ type: "APPLY_TO_JOB", jobTitle: state.activeJob!.title, employer: state.activeJob!.employer })}
            />
          </CardContent>
        )}

        {state.step === "interview_confirmed" && (
          <>
            <CardHeader>
              <CardTitle>Interview Confirmed ✓</CardTitle>
              <CardDescription>
                Your interview for <span className="font-medium">{state.activeJob?.title}</span> is set.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.accommodations.length > 0 ? (
                <div>
                  <p className="text-sm font-medium mb-2">Confirmed accommodations:</p>
                  <div className="flex flex-wrap gap-2">
                    {state.accommodations.map((a) => (
                      <Badge key={a} variant="secondary">
                        {a.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Coordination handled via VR4Deaf, DeafAuth, and PinkSync.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No accommodations requested.</p>
              )}
              <Button onClick={() => send({ type: "INTERVIEW_PLACED" })} className="flex items-center gap-2">
                I got the job! <PartyPopper className="h-4 w-4" />
              </Button>
            </CardContent>
          </>
        )}

        {state.step === "placed" && (
          <>
            <CardHeader>
              <CardTitle>Congratulations! 🎉</CardTitle>
              <CardDescription>
                You&apos;ve been placed as <span className="font-medium">{state.activeJob?.title}</span> at{" "}
                <span className="font-medium">{state.activeJob?.employer}</span>. Your journey continues — your job
                specialist will follow up in 30 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => send({ type: "RESET" })} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" /> Start a new journey
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
