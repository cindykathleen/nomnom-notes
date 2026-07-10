import { Suspense } from 'react';
import getCurrentUser from '@/app/lib/getCurrentUser';
import PublicNav from '@/app/components/PublicNav';
import Nav from '@/app/components/Nav';
import Hero from '@/app/components/Hero';
import Overview from '@/app/components/Overview';
import HowItWorks from '@/app/components/HowItWorks';
import ListsLoading from '@/app/components/ListsLoading';
import DndWrapper from '@/app/components/DndWrapper';
import CustomLists from '@/app/lists/CustomLists';

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
              <div className="page-layout-inner space-y-6 xl:space-y-8">
                <h1 className="page-heading">My lists</h1>
                <Suspense fallback={<ListsLoading />}>
                  <DndWrapper>
                    <CustomLists userId={userId} />
                  </DndWrapper>
                </Suspense>
              </div>
            </div>
          </>
      }
    </div>
  );
}