import getCurrentUser from '@/app/lib/getCurrentUser';
import { db } from '@/app/lib/database';
import Nav from '@/app/components/Nav';
import SearchForm from './SearchForm';

export default async function Page() {
  const userId = await getCurrentUser(false);

  let lists;

  try {
    lists = await db.getLists(userId);

    if (!lists) {
      return <div>Error fetching lists</div>;
    }
  } catch (err) {
    return <div>Error fetching lists</div>;
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