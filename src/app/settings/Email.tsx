'use client';

import { useState } from 'react';
import { User } from '@/app/interfaces/interfaces';
import SubmitButton from '@/app/components/SubmitButton';
import { updateEmail } from '@/app/actions/authentication';
import { updateUserEmail } from '@/app/actions/user';

export default function Email({ user }: { user: User }) {
  const [inputEmail, setInputEmail] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const result = await updateEmail(formData); // Update it in BetterAuth auth database

    if (result.error) {
      setMessage(result.error);
    } else {
      const result2 = await updateUserEmail(formData, user._id); // Update it in main database

      if (result2.error) {
        setMessage(result2.error);
      } else {
        setMessage('Email updated successfully');
      }
    }

    setInputEmail('');
  }

  return (
    <div>
      <h4 className="tab-content-heading">Change Your Account Email</h4>
      <hr className="hidden border-lightgray xl:block" />
      <form action={handleSubmit} className="max-w-[700px] pt-2 flex flex-col xl:pt-8">
        <p className="mb-6 description-sm"><span className="font-normal">Current email address:</span> {user.email}</p>
        <label htmlFor="user-email">New email address</label>
        <input id="user-email" name="user-email" type="email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)}
          className="w-full input" autoComplete="off" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <SubmitButton className="self-start" data-cy="edit-email-submit">
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
