import getCurrentUser from '@/app/lib/getCurrentUser';
import { getUser } from '@/app/lib/dbFunctions';
import Nav from '@/app/components/Nav';
import Tabs from './Tabs';

export default async function Page() {
  const userId = await getCurrentUser(false);
  const user = await getUser(userId);

  return (
    <>
      <Nav />
      <div className="gated-page-layout">
        <div className="gated-page-layout-inner">
          { user && (
            <>
              <h1 className="page-heading">Account settings</h1>
              <Tabs user={user} />
            </>
          )}
          { !user && (
            <>
              <h1 className="page-heading">Uh oh!</h1>
              <p>We are not able to load your account information. Please try again.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}