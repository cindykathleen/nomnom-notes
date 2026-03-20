import { Suspense } from 'react';
import getCurrentUser from '@/app/lib/getCurrentUser';
import Nav from '@/app/components/Nav';
import ListsLoading from '@/app/components/ListsLoading';
import DndWrapper from '@/app/components/DndWrapper';
import CustomLists from '@/app/components/CustomLists';

export default async function HomePage() {
  const userId = await getCurrentUser(false);

  return (
    <div>
      <Nav userId={userId} />
      <div className="gated-page-layout">
        <div className="gated-page-layout-inner">
          <h1 className="page-heading">My lists</h1>
          <Suspense fallback={<ListsLoading />}>
            <DndWrapper>
              <CustomLists userId={userId} />
            </DndWrapper>
          </Suspense>
        </div>
      </div>
    </div>
  );
}