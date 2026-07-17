'use client';

import { useState } from 'react';
import { User, List } from '@/app/interfaces/interfaces';
import { acceptInvitation, declineInvitation } from '@/app/actions/invitation';

export default function InvitationForm({ user, owner, list, token }: { user: User, owner: User, list: List, token: string }) {
  const [heading, setHeading] = useState<string>('Share Your Notes');
  const [message, setMessage] = useState<string | React.ReactNode>(`${owner.name} has invited you to collaborate on their list, ${list.name}.`);
  const [showButtons, setShowButtons] = useState<boolean>(true);

  const handleAccept = async () => {
    const invitation = await acceptInvitation(user._id, token);

    setShowButtons(false);

    if ('error' in invitation) {
      setHeading('Error Accepting Invitation');
      setMessage(`${invitation.error}`);
      return;
    }

    setHeading('You Have Accepted the Invitation');
    setMessage(
      <>
        <a href={`/list/${list._id}`}
          className="link text-darkpink">
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
      setHeading('Error Declining Invitation');
      setMessage(`${invitation.error}`);
      return;
    }

    setHeading('You Have Declined the Invitation');
    setMessage('Please contact the list owner if you change your mind.');
  }

  return (
    <div className="form-layout space-y-4 text-center">
      <h3 className="form-heading">{heading}</h3>
      <p className="form-description description">{message}</p>
      { // Show buttons only if the invitation hasn't been responded to yet
        showButtons && (
          <div className="flex items-center justify-center gap-4">
            <button type="button" className="button-primary" onClick={handleAccept}>
              Accept
            </button>
            <button type="button" className="button-secondary" onClick={handleDecline}>
              Decline
            </button>
          </div>
        )
      }
    </div>
  );
}