'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updatePasssword } from '@/app/actions/authentication';

export default function Password() {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmation, setConfirmation] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const passwordMatch = newPassword === confirmation;
  const { pending } = useFormStatus();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

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
      <h3 className="accordion-content-heading">Change your account password</h3>
      <hr className="hidden border-lightgray xl:block" />
      <form onSubmit={handleSubmit} className="max-w-[700px] pt-2 flex flex-col xl:pt-8">
        <label htmlFor="current-password" className="pb-1 font-semibold">Current password</label>
        <input id="current-password" name="current-password" type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)}
          className="input" autoComplete="off" />
        <label htmlFor="new-password" className="pb-1 font-semibold">New password</label>
        <input id="new-password" name="new-password" type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)}
          className="input" autoComplete="off" />
        <label htmlFor="password-confirmation" className="pb-1 font-semibold">Re-enter your new password</label>
        {!passwordMatch && confirmation && (<p className="pb-3 text-sm text-red-600 font-semibold">The passwords do not match</p>)}
        <input id="password-confirmation" type="password" required value={confirmation} onChange={e => setConfirmation(e.target.value)}
          className="input" autoComplete="off" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button type="submit" className="button-primary">
            {pending
              ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block m-auto size-6 animate-spin" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>)
              : ("Update")
            }
          </button>
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