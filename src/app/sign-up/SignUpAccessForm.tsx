'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignUpButton } from './SignUpButton';

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
    <div className="form-layout">
      {
        errorMessage === '' && (
          <>
            <h2 className="form-heading">Please enter the access code</h2>
            <p className="form-paragraph">If you do not have one, please ask the application owner.</p>
            <p className="form-paragraph">
              Already have an account? Click
              <Link href="/sign-in/" className="text-darkpink hover:text-mauve transition-colors"> here </Link>
              to sign in.
            </p>
          </>
        )
      }
      { // Display for errors
        errorMessage && (
          <>
            <h2 className="pb-2 text-3xl font-semibold text-center">{errorMessage}</h2>
            <p className="form-paragraph">The access code you have entered is not correct. Please try again or contact the application owner.</p>
          </>
        )
      }
      <hr className="border-slategray" />
      <form onSubmit={handleSubmit} className="w-full p-4 flex flex-col">
        <label htmlFor="access-code" className="pb-1 font-semibold">Access code</label>
        <input id="access-code" name="access-code" type="access-code" required value={accessCode} onChange={e => setAccessCode(e.target.value)}
          className="input" autoComplete="off" />
        <SignUpButton disabled={!formIsValid} />
      </form>
    </div>
  );
}