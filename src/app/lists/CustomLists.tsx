import getDb from '@/app/lib/db';
import { List } from '@/app/interfaces/interfaces';
import ListCard from './ListCard';
import ListAddCard from './ListAddCard';
import { getAllUsers } from '@/app/actions/user';

export default async function CustomLists({ userId }: { userId: string }) {
  const db = await getDb();
  
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
    <div className="gated-page-layout">
      <div className="gated-page-layout-inner">
        <h1 className="text-4xl font-semibold">My lists</h1>
        <div className="cards">
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