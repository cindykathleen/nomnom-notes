import { getUser } from '@/app/lib/dbFunctions';
import getCurrentUser from '@/app/lib/getCurrentUser';
import Nav from '@/app/components/Nav';
import Profile from './Profile';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(id);
  const currentUserId = await getCurrentUser(false);

  return (
    <div>
      <Nav userId={currentUserId} />
      { // User not found
        !user && (
          <div className="gated-page-layout">
            <div className="gated-page-layout-inner">
              <h1 className="page-heading">Uh oh!</h1>
              <p className="text-xl">We are not able to find the user you are looking for. Please double-check the user ID and try again.</p>
            </div>
          </div>
        )
      }
      { // User found and the profile privacy is off or it is the user's own profile
        user && (user.profilePrivacy !== true || user._id === currentUserId) ? (
          <Profile user={user} />
        ) : (
          <div className="gated-page-layout">
            <div className="gated-page-layout-inner">
              <h1 className="page-heading">Uh oh!</h1>
              <p className="text-xl">This user turned on their profile privacy. Please contact them for access.</p>
            </div>
          </div>
        )
      }
    </div>
  );
}