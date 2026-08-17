import { notFound } from 'next/navigation';
import getCurrentUser from '@/app/lib/getCurrentUser';
import { getRanking, isRankingOwnerDb } from '@/app/lib/dbFunctions';
import Nav from '@/app/components/Nav';
import CustomRanking from './CustomRanking';

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const userId = await getCurrentUser(false);

  const ranking = await getRanking(id);
  if (!ranking || !(await isRankingOwnerDb(userId, id))) {
    notFound();
  }

  return (
    <div className="outer-layout">
      <Nav userId={userId} />
      <CustomRanking userId={userId} rankingId={id} />
    </div>
  );
}
