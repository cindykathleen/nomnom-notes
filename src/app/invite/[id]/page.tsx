import { getUser, getOwnerByToken, getListByToken } from '@/app/lib/dbFunctions';
import getCurrentUser from '@/app/lib/getCurrentUser';
import { checkInvitation } from '@/app/actions/invitation';
import PublicNav from '@/app/components/PublicNav';
import Nav from '@/app/components/Nav';
import InvitationForm from './InvitationForm';
import ErrorMessage from './ErrorMessage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const userId = await getCurrentUser(false);
  const user = await getUser(userId);
  const owner = await getOwnerByToken(id);
  const list = await getListByToken(id);

  if (!user || !owner || !list) {
    return;
  }

  let validInvitation = true;
  const invitation = await checkInvitation(id);

  if ('error' in invitation) {
    validInvitation = false;
  }

  return (
    <div className="outer-layout">
      { // Display a different nav bar for public users
        userId === 'public' ? <PublicNav /> : <Nav userId={userId} />
      }
      <div className="page-layout h-screen bg-coolbeige">
      <div className="page-layout-inner items-center justify-center">
          { // No error found and invitation is valid
            validInvitation && (
              <InvitationForm user={user} owner={owner} list={list} token={id} />
            )}
          { // Error found and invitation is not valid
            !validInvitation && (
              <ErrorMessage message={invitation.error} />
            )}
        </div>
      </div>
    </div>
  );
}