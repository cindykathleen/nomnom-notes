import { getUser } from '@/app/lib/dbFunctions';
import Nav from '@/app/components/Nav';
import Profile from './Profile';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(id);

  return (
    <div>
      <Nav />
      { // User not found
        !user && (
          <p>No profile found</p>
        )
      }
      { // User found
        user && (
          <Profile user={user} />
        )
      }
    </div>
  );
}