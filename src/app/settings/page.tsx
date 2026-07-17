import getCurrentUser from '@/app/lib/getCurrentUser';
import { getUser } from '@/app/lib/dbFunctions';
import Nav from '@/app/components/Nav';
import Tabs from './Tabs';

export default async function Page() {
  const userId = await getCurrentUser(false);
  const user = await getUser(userId);

  return (
    <div className="outer-layout">
      <Nav userId={userId} />
      <div className="page-layout">
        <div className="page-layout-inner space-y-6 xl:space-y-8">
          { user && (
            <>
              <h2>Account Settings</h2>
              <Tabs user={user} />
            </>
          )}
          { !user && (
            <>
              <h2>Uh oh!</h2>
              <p className="subheading">We are not able to load your account information. Please try again.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}