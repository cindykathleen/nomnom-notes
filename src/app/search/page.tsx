import getCurrentUser from '@/app/lib/getCurrentUser';
import { db } from '@/app/lib/database';
import { List } from '@/app/interfaces/interfaces';
import Nav from '@/app/components/Nav';
import SearchForm from './SearchForm';

export default async function Page() {
  const userId = await getCurrentUser(false);
  let listIds = await db.getListIds(userId);
  let lists: List[] = [];

  try {
    lists = await Promise.all(
      listIds.map(async (listId) => {
        const list = await db.getList(listId);

        if (!list) {
          throw new Error(`List with ID ${listId} not found`);
        }

        return list;
      })
    );
  } catch (err) {
    throw new Error(`Error fetching lists: ${err}`);
  }

  return (
    <div>
      <Nav />
      <div className="relative h-full w-screen p-16 mt-[80px] flex justify-center">
        <div className="max-w-[1440px] w-full px-8 flex flex-col space-y-8">
          <div>
            <h1 className="text-4xl font-semibold">Search</h1>
          </div>
          <SearchForm lists={lists} />
        </div>
      </div >
    </div>
  );
}