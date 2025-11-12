import { db } from '@/app/lib/database';
import { List } from '@/app/interfaces/interfaces';
import ListCard from './ListCard';
import ListAddCard from './ListAddCard';
import { getAllUsers } from '@/app/actions/user';

export default async function CustomLists({ userId }: { userId: string }) {
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

  const getRole = async (listId: string) => {
    const isOwner = await db.isOwner(userId, listId);
    return isOwner ? 'owner' : 'collaborator';
  }

  const getUsers = async (listId: string) => {
    return await getAllUsers(listId);
  }

  return (
    <div className="relative top-[80px] min-h-[calc(100vh-80px)] h-auto w-screen box-border p-8 flex justify-center xl:p-16">
      <div className="max-w-[1440px] w-full flex flex-col space-y-6 xl:space-y-8">
        <h1 className="text-4xl font-semibold">My lists</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 xl:grid-cols-4">
          {lists.map(async (list: List) => {
            const role = await getRole(list._id);
            const users = await getUsers(list._id);
            return <ListCard key={list._id} userId={userId} role={role} list={list} lists={lists} users={users} />;
          })}
          <ListAddCard userId={userId} />
        </div>
      </div>
    </div>
  );
}