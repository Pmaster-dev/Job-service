"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ExternalLink, ShieldCheck, Zap, Eye } from "lucide-react"

const ACCOMMODATION_OPTIONS = [
  { id: "asl", label: "ASL Interpreter", description: "In-person or remote American Sign Language interpreter" },
  { id: "cart", label: "CART Captioning", description: "Real-time speech-to-text transcription on screen" },
  { id: "vrs", label: "Video Relay Service (VRS)", description: "Video interpreting via VR4Deaf relay integration" },
  { id: "written", label: "Written Communication", description: "Interviewer communicates in writing throughout" },
  { id: "visual_alerts", label: "Visual Alerts & Signals", description: "No audio-only cues; all prompts are visual" },
  { id: "extended_time", label: "Extended Response Time", description: "Additional time for processing and responding" },
]

const ECOSYSTEM_BADGES = [
  {
    label: "VR4Deaf",
    description: "VRS & relay verified",
    icon: <Eye className="h-3 w-3" />,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    href: "https://github.com/pinkycollie/vr4deaf",
  },
  {
    label: "DeafAuth",
    description: "Identity verified",
    icon: <ShieldCheck className="h-3 w-3" />,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    href: "https://github.com/pinkycollie/Nextjs-DeafAUTH",
  },
  {
    label: "PinkSync",
    description: "Coordination sync",
    icon: <Zap className="h-3 w-3" />,
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    href: "https://github.com/pinkycollie/PinkSync",
  },
]

interface InterviewAccommodationsProps {
  jobTitle: string
  employer: string
  onConfirm: (accommodations: string[]) => void
  onBack: () => void
}

export function InterviewAccommodations({ jobTitle, employer, onConfirm, onBack }: InterviewAccommodationsProps) {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Interview Accommodations</h3>
        <p className="text-sm text-muted-foreground mt-1">
          For <span className="font-medium">{jobTitle}</span> at <span className="font-medium">{employer}</span> — select
          what you need. Your request is securely coordinated through:
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {ECOSYSTEM_BADGES.map((badge) => (
            <a
              key={badge.label}
              href={badge.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${badge.color} hover:opacity-80 transition-opacity`}
            >
              {badge.icon}
              {badge.label}
              <span className="opacity-70">· {badge.description}</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-50" />
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {ACCOMMODATION_OPTIONS.map((option) => (
          <label
            key={option.id}
            htmlFor={option.id}
            className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          >
            <Checkbox
              id={option.id}
              checked={selected.includes(option.id)}
              onCheckedChange={() => toggle(option.id)}
              className="mt-0.5"
            />
            <div>
              <span className="font-medium text-sm">{option.label}</span>
              <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
            </div>
          </label>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((id) => {
            const opt = ACCOMMODATION_OPTIONS.find((o) => o.id === id)
            return (
              <Badge key={id} variant="secondary" className="text-xs">
                {opt?.label}
              </Badge>
            )
          })}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={() => onConfirm(selected)} disabled={selected.length === 0}>
          Confirm & Schedule Interview
        </Button>
      </div>
    </div>
  )
}
