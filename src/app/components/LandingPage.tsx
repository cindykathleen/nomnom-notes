import Hero from '@/app/components/Hero';
import Overview from '@/app/components/Overview';
import HowItWorks from '@/app/components/HowItWorks';

export default function LandingPage() {
  return (
    <div className="homepage-layout">
      <section className="bg-texture">
        <Hero />
      </section>
      <div className="homepage-layout-inner">
        <section>
          <Overview />
        </section>
        <section>
          <HowItWorks />
        </section>
      </div>
    </div>
  );
}
