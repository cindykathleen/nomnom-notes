import { Suspense } from 'react';
import getCurrentUser from '@/app/lib/getCurrentUser';
import Nav from '@/app/components/Nav';
import ListsLoading from '@/app/components/ListsLoading';
import CustomRankings from './CustomRankings';

export default async function Page() {
  const userId = await getCurrentUser(false);

  return (
    <div className="outer-layout">
      <Nav userId={userId} />
      <div className="page-layout">
        <div className="page-layout-inner">
          <Suspense fallback={<ListsLoading />}>
            <CustomRankings userId={userId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
