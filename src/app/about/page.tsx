import getCurrentUser from '@/app/lib/getCurrentUser';
import PublicNav from '@/app/components/PublicNav';
import Nav from '@/app/components/Nav';
import Hero from './Hero';
import Overview from './Overview';

export default async function Page() {
  const userId = await getCurrentUser(true);

  return (
    <>
      { // Display a different nav bar for public users
        userId === 'public' ? <PublicNav /> : <Nav userId={userId} />
      }
      <div className="snap-layout">
        <div className="snap-layout-inner">
          <section>
            <Hero />
          </section>
          <section>
            <Overview />
          </section>
        </div>
      </div>
    </>
  );
}