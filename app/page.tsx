import Link from 'next/link'
import { HeroSection } from '@/components/home/HeroSection'
import { QuickNavSection } from '@/components/home/QuickNavSection'
import { SpecialitiesSection } from '@/components/home/SpecialitiesSection'
import { WhyGlidSection } from '@/components/home/WhyGlidSection'
import { AppSection } from '@/components/home/AppSection'
import { BlogSection } from '@/components/home/BlogSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { PartnerCTASection } from '@/components/home/PartnerCTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickNavSection />
      <SpecialitiesSection />
      <WhyGlidSection />
      <AppSection />
      <BlogSection />
      <TestimonialsSection />
      <PartnerCTASection />
    </>
  )
}
