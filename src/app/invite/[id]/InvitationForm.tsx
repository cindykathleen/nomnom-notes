'use client';

import { useState } from 'react';
import { User, List } from '@/app/interfaces/interfaces';
import { acceptInvitation, declineInvitation } from '@/app/actions/invitation';

export default function InvitationForm({ user, owner, list, token }: { user: User, owner: User, list: List, token: string }) {
  const [heading, setHeading] = useState<string>('Share your notes');
  const [message, setMessage] = useState<string | React.ReactNode>(`${owner.name} has invited you to collaborate on their list, ${list.name}.`);
  const [showButtons, setShowButtons] = useState<boolean>(true);

  const handleAccept = async () => {
    const invitation = await acceptInvitation(user._id, token);

    setShowButtons(false);

    if ('error' in invitation) {
      setHeading('Error accepting invitation');
      setMessage(`${invitation.error}`);
      return;
    }

    setHeading('You have accepted the invitation');
    setMessage(
      <>
        <a href={`/list/${list._id}`}
          className="font-semibold text-darkpink hover:text-mauve transition-colors">
          {list.name}
        </a>{" "}
        has been added to your lists. You can start collaborating now!
      </>
    );
  }

  const handleDecline = async () => {
    const invitation = await declineInvitation(user._id, token);

    setShowButtons(false);

    if ('error' in invitation) {
      setHeading('Error declining invitation');
      setMessage(`${invitation.error}`);
      return;
    }

    setHeading('You have declined the invitation');
    setMessage('Please contact the list owner if you change your mind.');
  }

  return (
    <div className="form-layout space-y-4 text-center">
      <h2 className="text-2xl font-semibold xl:text-3xl">{heading}</h2>
      <p className="text-lg xl:text-xl">{message}</p>
      { // Show buttons only if the invitation hasn't been responded to yet
        showButtons && (
          <div className="flex items-center justify-center gap-4">
            <button type="button"
              className="px-8 py-1.5 text-sm text-snowwhite font-semibold text-center bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors"
              onClick={handleAccept}>
              Accept
            </button>
            <button type="button"
              className="px-8 py-1.5 text-sm text-darkpink font-semibold text-center bg-transparent border border-darkpink rounded-lg cursor-pointer hover:text-mauve hover:border-mauve transition-colors"
              onClick={handleDecline}>
              Decline
            </button>
          </div>
        )
      }
    </div>
  );
}