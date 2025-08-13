import { db } from '@/app/lib/database';
import { List } from '@/app/interfaces/interfaces';
import ListCard from './ListCard';
import ListAddCard from './ListAddCard';

export default async function CustomLists() {
  let lists;

  try {
    lists = await db.getLists();

    if (!lists) {
      return <div>Error fetching lists</div>;
    }
  } catch (err) {
    return <div>Error fetching lists</div>;
  }

  return (
    <div className="relative h-full w-screen p-16 mt-[80px] flex justify-center">
      <div className="max-w-[1440px] w-full px-8 flex flex-col space-y-8">
        <h1 className="text-4xl font-semibold">My lists</h1>
        <div className="grid grid-cols-4 gap-16">
          {lists.map((list: List) => (
            <ListCard key={list._id} list={list} />
          ))}
          <ListAddCard />
        </div>
      </div>
    </div>
  );
}