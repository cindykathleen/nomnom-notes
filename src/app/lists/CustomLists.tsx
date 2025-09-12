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
    <div className="relative h-full w-screen p-16 mt-[80px] flex justify-center">
      <div className="max-w-[1440px] w-full px-8 flex flex-col space-y-8">
        <h1 className="text-4xl font-semibold">My lists</h1>
        <div className="grid grid-cols-4 gap-16">
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