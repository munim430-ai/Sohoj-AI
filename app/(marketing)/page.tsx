import { Hero } from '@/components/marketing/hero'
import { LogosMarquee } from '@/components/marketing/logos-marquee'
import { Pillars } from '@/components/marketing/pillars'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Pricing } from '@/components/marketing/pricing'
import { Testimonials } from '@/components/marketing/testimonials'
import { FinalCta } from '@/components/marketing/final-cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogosMarquee />
      <Pillars />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FinalCta />
    </>
  )
}
