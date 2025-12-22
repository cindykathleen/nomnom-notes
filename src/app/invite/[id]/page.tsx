import getDb from '@/app/lib/db';
import getCurrentUser from '@/app/lib/getCurrentUser';
import { checkInvitation } from '@/app/actions/invitation';
import InvitationForm from './InvitationForm';
import ErrorMessage from './ErrorMessage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const db = await getDb();

  const userId = await getCurrentUser(false);
  const user = await db.getUser(userId);
  const owner = await db.getOwnerByToken(id);
  const list = await db.getListByToken(id);

  if (!user || !owner || !list) {
    return;
  }

  let validInvitation = true;
  const invitation = await checkInvitation(id);

  if ('error' in invitation) {
    validInvitation = false;
  }

  return (
    <div className="page-layout">
      <div className="page-layout-inner">
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
  );
}