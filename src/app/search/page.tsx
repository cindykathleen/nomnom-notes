import getDb from '@/app/lib/db';
import getCurrentUser from '@/app/lib/getCurrentUser';
import { List } from '@/app/interfaces/interfaces';
import Nav from '@/app/components/Nav';
import Search from './Search'

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
  const db = await getDb();
  
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

  const searchParams = await props.searchParams;
  const query = searchParams.query;

  return (
    <div>
      <Nav />
      <Search query={query} userId={userId} lists={lists} />
    </div>
  );
}