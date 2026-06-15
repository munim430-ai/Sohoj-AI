import { Reveal } from '@/components/marketing/reveal'
import { Badge } from '@/components/ui/badge'
import { StarIcon } from '@/components/marketing/icons'

type Testimonial = { quote: string; name: string; role: string }

// Dormant by default — populate with real reviews to activate this section.
const testimonials: Testimonial[] = []

export function Testimonials() {
  return (
    <section className="bg-slate py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge>Loved by sellers</Badge>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Real stories, coming soon
          </h2>
          <p className="mt-4 text-lg text-navy/60">
            We’re onboarding our first Bangladeshi sellers now. Their words will live
            right here.
          </p>
        </Reveal>

        {testimonials.length > 0 ? (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="rounded-4xl border border-navy/5 bg-white p-7 shadow-soft"
              >
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} width={16} height={16} />
                  ))}
                </div>
                <blockquote className="mt-4 leading-relaxed text-navy/75">“{t.quote}”</blockquote>
                <figcaption className="mt-5">
                  <p className="font-display text-sm font-semibold text-navy">{t.name}</p>
                  <p className="text-xs text-navy/45">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-start rounded-4xl border border-dashed border-navy/15 bg-white/50 p-7"
              >
                <div className="flex gap-1 text-amber-300/70">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <StarIcon key={s} width={16} height={16} />
                  ))}
                </div>
                <p className="mt-4 font-display text-sm font-semibold text-navy/40">
                  Your customers’ words will live here
                </p>
                <p className="mt-2 text-sm text-navy/30">
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
