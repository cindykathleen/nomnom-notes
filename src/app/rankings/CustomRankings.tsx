import { getRankingIds, getRanking } from '@/app/lib/dbFunctions';
import { RankingList } from '@/app/interfaces/interfaces';
import RankingCard from './RankingCard';
import RankingAddCard from './RankingAddCard';

export default async function CustomRankings({ userId }: { userId: string }) {
  const rankingIds = await getRankingIds(userId);
  let rankings: RankingList[] = [];

  try {
    rankings = await Promise.all(
      rankingIds.map(async (rankingId) => {
        const ranking = await getRanking(rankingId);

        if (!ranking) {
          throw new Error(`Ranking with ID ${rankingId} not found`);
        }

        return ranking;
      })
    );
  } catch (err) {
    throw new Error(`Error fetching rankings: ${err}`);
  }

  return (
    <div className="cards">
      {rankings.map((ranking: RankingList) => (
        <RankingCard key={ranking._id} userId={userId} ranking={ranking} />
      ))}
      <RankingAddCard userId={userId} />
    </div>
  );
}
