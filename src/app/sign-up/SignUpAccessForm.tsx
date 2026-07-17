'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignUpButton } from './SignUpButton';

export const SignUpAccessForm = ({
  handleAccessFormSubmit,
  errorMessage,
  clearErrorMessage,
}: {
  handleAccessFormSubmit: (accessCode: string) => void;
  errorMessage: string;
  clearErrorMessage: () => void;
}) => {
  const [accessCode, setAccessCode] = useState<string>('');

  const formIsValid = accessCode.trim() !== '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const accessCode = formData.get('access-code') as string;
    handleAccessFormSubmit(accessCode);
  }

  // If the user is not allowed, display the modal asking for the access code
  return (
    <div className="form-layout">
      <h3 className="form-heading">Enter the Access Code</h3>
      <p className="form-description description-sm">If you do not have one, please ask the application owner.</p>
      <p className="form-description description-sm">
        Already have an account? Click
        <Link href="/sign-in/" className="link text-darkpink"> here </Link>
        to sign in.
      </p>
      <hr className="border-lightgray" />
      <form onSubmit={handleSubmit} className="w-full p-4 flex flex-col">
        <label htmlFor="access-code">Access code</label>
        <input id="access-code" name="access-code" type="access-code" required value={accessCode} onChange={e => setAccessCode(e.target.value)}
          className="input" autoComplete="off" />
        <SignUpButton disabled={!formIsValid} />
        { // Alert for errors
          errorMessage && (
            <div className="modal">
              <div role="alert" className="modal-alert-inner items-center justify-center">
                <h4>{errorMessage}</h4>
                <button type="button" className="button-primary" onClick={clearErrorMessage}>
                  Try again
                </button>
              </div>
            </div>
          )
        }
      </form>
    </div>
  );
}