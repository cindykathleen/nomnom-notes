import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import { db } from '@/app/lib/database';
import Nav from '@/app/components/Nav';
import SearchForm from './SearchForm';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session) {
    redirect('/sign-in');
  }

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