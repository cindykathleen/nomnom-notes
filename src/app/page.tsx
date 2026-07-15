import getCurrentUser from '@/app/lib/getCurrentUser';
import PublicNav from '@/app/components/PublicNav';
import Nav from '@/app/components/Nav';
import Hero from '@/app/components/Hero';
import Overview from '@/app/components/Overview';
import HowItWorks from '@/app/components/HowItWorks';

export default async function HomePage() {
  const userId = await getCurrentUser(true);

  return (
    <div className="outer-layout">
      { // Display a different page for public vs. registered users
        userId === 'public' ?
          <>
            <PublicNav />
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
          </>
          :
          <>
            <Nav userId={userId} />
            <div className="page-layout">
              <div className="page-layout-inner">

              </div>
            </div>
          </>
      }
    </div>
  );
}