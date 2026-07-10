import { Suspense } from 'react';
import getCurrentUser from '@/app/lib/getCurrentUser';
import Nav from '@/app/components/Nav';
import ListsLoading from '@/app/components/ListsLoading';
import DndWrapper from '@/app/components/DndWrapper';
import CustomLists from './CustomLists';

export default async function Page() {
  const userId = await getCurrentUser(false);

  return (
    <div className="outer-layout">
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
    </div>
  );
}