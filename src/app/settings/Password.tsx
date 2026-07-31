'use client';

import { useState } from 'react';
import SubmitButton from '@/app/components/SubmitButton';
import { updatePasssword } from '@/app/actions/authentication';

export default function Password() {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmation, setConfirmation] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const passwordMatch = newPassword === confirmation;

  const handleSubmit = async (formData: FormData) => {
    const result = await updatePasssword(formData); // Update it in BetterAuth auth database

    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage('Password updated successfully');
    }

    setOldPassword('');
    setNewPassword('');
    setConfirmation('');
  }

  return (
    <div>
      <h4 className="tab-content-heading">Change Your Account Password</h4>
      <hr className="hidden border-lightgray xl:block" />
      <form action={handleSubmit} className="max-w-[700px] pt-2 flex flex-col xl:pt-8">
        <label htmlFor="current-password">Current password</label>
        <input id="current-password" name="current-password" type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)}
          className="input" autoComplete="off" />
        <label htmlFor="new-password">New password</label>
        <input id="new-password" name="new-password" type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)}
          className="input" autoComplete="off" />
        <label htmlFor="password-confirmation">Re-enter your new password</label>
        {!passwordMatch && confirmation && (<p className="pb-3 text-sm text-red-600 font-semibold">The passwords do not match</p>)}
        <input id="password-confirmation" name="password-confirmation" type="password" required value={confirmation} onChange={e => setConfirmation(e.target.value)}
          className="input" autoComplete="off" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <SubmitButton className="self-start" data-cy="edit-password-submit">
            Update
          </SubmitButton>
          { // Display a message if it exists
            message && (
              <p className="font-semibold">{message}</p>
            )
          }
        </div>
      </form>
    </div>
  );
}
