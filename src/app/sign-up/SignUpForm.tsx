'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@/app/interfaces/interfaces';
import Link from 'next/link';
import { SignUpButton } from './SignUpButton';
import { signUp } from '@/app/actions/authentication';
import { addUser } from '@/app/actions/user';

export const SignUpForm = ({ signInUrl, owner }: { signInUrl: string, owner: User | null }) => {
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmation, setConfirmation] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const passwordMatch = password === confirmation;

  const formIsValid =
    displayName.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmation.trim() !== '' &&
    passwordMatch;

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await signUp(formData);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      await addUser();
      router.push(redirect);
    }
  }

  return (
    <div className="form-layout">
      <h3 className="form-heading">Create an Account</h3>
      { // If the user was redirected from an invitation link, show this message
        redirect && owner && (
          <p className="form-description description-sm">
            {owner.name} has invited you to collaborate on their list. Create an account to accept the invitation.
          </p>
        )
      }
      <p className="form-description description-sm">
        Already have an account? Click
        <Link href={signInUrl} className="link text-darkpink"> here </Link>
        to sign in.
      </p>
      <hr className="border-lightgray" />
      <form onSubmit={handleSubmit} className="p-4 flex flex-col">
        <label htmlFor="display-name">Display name</label>
        <input id="display-name" name="display-name" type="text" required value={displayName} onChange={e => setDisplayName(e.target.value)}
          className="input" autoComplete="off" />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
          onInvalid={e => { e.preventDefault(); setErrorMessage('Invalid email address'); }}
          className="input" autoComplete="off" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
          className="input" autoComplete="off" />
        <label htmlFor="password-confirmation">Re-enter your password</label>
        {!passwordMatch && confirmation && (<p className="pb-3 text-sm text-red-600 font-normal">The passwords do not match</p>)}
        <input id="password-confirmation" type="password" required value={confirmation} onChange={e => setConfirmation(e.target.value)}
          className="input" autoComplete="off" />
        <SignUpButton disabled={!formIsValid} />
        { // Alert for errors
        errorMessage && (
          <div className="modal">
            <div role="alert" className="modal-alert-inner items-center justify-center">
              <h4>{errorMessage}</h4>
              <button type="button" className="button-primary"
                onClick={() => setErrorMessage('')}>
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