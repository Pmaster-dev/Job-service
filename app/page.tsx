import { Header } from "@/components/header"
import { JobSeekerFlow } from "@/components/job-seeker-flow"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">Job-Magician</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Deaf-first · Event-driven · Accommodation-ready
          </p>
        </div>
        <JobSeekerFlow />
      </main>
    </div>
  )
}
