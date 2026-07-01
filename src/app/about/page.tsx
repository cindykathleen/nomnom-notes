import getCurrentUser from '@/app/lib/getCurrentUser';
import PublicNav from '@/app/components/PublicNav';
import Nav from '@/app/components/Nav';
import Hero from './Hero';

export default async function Page() {
  const userId = await getCurrentUser(true);

  return (
    <>
      { // Display a different nav bar for public users
        userId === 'public' ? <PublicNav /> : <Nav userId={userId} />
      }
      <div className="gated-page-layout">
        <div className="gated-page-layout-inner">
          <Hero />
        </div>
      </div>
    </>
  );
}