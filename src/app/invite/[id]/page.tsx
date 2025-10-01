import getCurrentUser from '@/app/lib/getCurrentUser';
import { db } from '@/app/lib/database';
import { checkInvitation } from '@/app/actions/invitation';
import InvitationForm from './InvitationForm';
import ErrorMessage from './ErrorMessage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
    <div className="relative h-screen w-screen p-16 flex items-center justify-center bg-coolbeige">
      <div className="max-w-[1440px] w-full flex flex-col items-center">
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