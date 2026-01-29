'use client';

import { useState } from 'react';
import { User } from '@/app/interfaces/interfaces';
import { updateEmail } from '@/app/actions/authentication';
import { updateUserEmail } from '@/app/actions/user';

export default function Email({ user }: { user: User }) {
  // States for the input fields
  const [inputEmail, setInputEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    await updateEmail(formData); // Update it in BetterAuth auth database
    await updateUserEmail(formData, user._id); // Update it in main database
    setInputEmail('');
  }

  return (
    <div>
      <h3 className="accordion-content-heading">Change your account email</h3>
      <hr className="hidden border-lightgray xl:block" />
      <form onSubmit={handleSubmit} className="max-w-[700px] pt-2 flex flex-col xl:pt-8">
        <div className="mb-6">
          <span className="font-semibold">Current email address: </span>
          <span>{user.email}</span>
        </div>
        <label htmlFor="user-email" className="pb-1 font-semibold">New email address</label>
        <input id="user-email" name="user-email" type="email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)}
          className="w-full input" autoComplete="off" />
        <button type="submit" className="button-primary">
          Update
        </button>
      </form>
    </div>
  );
}