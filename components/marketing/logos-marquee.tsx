import {
  FacebookMark,
  MessengerMark,
  InstagramMark,
  BkashMark,
  SupabaseMark,
  VercelMark,
} from '@/components/marketing/icons'

const integrations = [
  { name: 'Facebook', Icon: FacebookMark },
  { name: 'Messenger', Icon: MessengerMark },
  { name: 'Instagram', Icon: InstagramMark },
  { name: 'bKash', Icon: BkashMark },
  { name: 'Supabase', Icon: SupabaseMark },
  { name: 'Vercel', Icon: VercelMark },
]

export function LogosMarquee() {
  return (
    <section className="border-y border-border bg-background py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Works with the tools your business already runs on
        </p>

        <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-14">
            {[...integrations, ...integrations].map(({ name, Icon }, i) => (
              <div
                key={`${name}-${i}`}
                className="flex shrink-0 items-center gap-2.5 text-muted-foreground"
              >
                <Icon width={24} height={24} />
                <span className="text-lg font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
