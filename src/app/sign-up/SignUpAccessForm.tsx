'use client';

import { useState } from 'react';
import { SignUpButton } from './SignUpButton';
import { checkAccessCode } from '@/app/actions/authentication';

export const SignUpAccessForm = ({
  handleAccessFormSubmit,
  errorMessage
}: {
  handleAccessFormSubmit: (accessCode: string) => void,
  errorMessage: string
}) => {
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [accessCode, setAccessCode] = useState<string>('');

  const formIsValid = accessCode.trim() !== '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const accessCode = formData.get('access-code') as string;
    handleAccessFormSubmit(accessCode);
  }

  // If the user is allowed, do not display the modal
  if (isAllowed) return;

  // If the user is not allowed, display the modal asking for the access code
  return (
    <div className="h-fit max-w-3xl px-8 py-6 bg-snowwhite rounded-3xl xl:px-12 xl:py-10">
      {
        errorMessage === '' && (
          <>
            <h2 className="pb-2 text-2xl font-semibold text-center xl:text-3xl">Please enter the access code</h2>
            <p className="pb-4 text-md font-semibold text-center">If you do not have one, please ask the application owner.</p>
          </>
        )
      }
      { // Display for errors
        errorMessage && (
          <>
            <h2 className="pb-2 text-3xl font-semibold text-center">{errorMessage}</h2>
            <p className="pb-4 text-md font-semibold text-center">The access code you have entered is not correct. Please try again or contact the application owner.</p>
          </>
        )
      }
      <hr className="border-slategray" />
      <form onSubmit={handleSubmit} className="w-full p-4 flex flex-col">
        <label htmlFor="access-code" className="pb-1 font-semibold">Access code</label>
        <input id="access-code" name="access-code" type="access-code" required value={accessCode} onChange={e => setAccessCode(e.target.value)}
          className="px-2 py-1 mb-6 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
        <SignUpButton disabled={!formIsValid} />
      </form>
    </div>
  );
}