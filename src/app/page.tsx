import { Navbar, Footer } from "@/components/layout";
import { Hero, Features, HowItWorks, Testimonials, CTA } from "@/components/landing";

/**
 * Landing Page
 * 
 * SEO-optimized landing page for MoodTrack.
 * All text content is managed in @/content/text.ts
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
