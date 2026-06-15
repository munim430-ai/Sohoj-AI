import { Star } from 'lucide-react'
import { Reveal } from '@/components/marketing/reveal'
import { Badge } from '@/components/ui/badge'

type Testimonial = { quote: string; name: string; role: string }

// Dormant by default — populate with real reviews to activate this section.
const testimonials: Testimonial[] = []

export function Testimonials() {
  return (
    <section className="border-y border-border bg-secondary/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge>Loved by sellers</Badge>
          <h2 className="mt-5 font-display text-4xl leading-[1] tracking-tight text-foreground sm:text-5xl">
            Real stories, coming <em className="italic">soon</em>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We’re onboarding our first Bangladeshi sellers now. Their words will live right here.
          </p>
        </Reveal>

        {testimonials.length > 0 ? (
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-border bg-background p-7">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 leading-relaxed text-foreground">“{t.quote}”</blockquote>
                <figcaption className="mt-5">
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-start rounded-2xl border border-dashed border-border bg-background/50 p-7"
              >
                <div className="flex gap-1 text-amber-300/70">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-300/70" />
                  ))}
                </div>
                <p className="mt-4 font-medium text-muted-foreground">
                  Your customers’ words will live here
                </p>
                <p className="mt-2 text-sm text-muted-foreground/70">
                  Verified reviews from real sohojAI sellers, activated at launch.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
