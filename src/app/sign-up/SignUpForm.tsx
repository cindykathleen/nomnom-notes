'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@/app/interfaces/interfaces';
import Link from 'next/link';
import { SignUpButton } from './SignUpButton';
import { signUp } from '@/app/actions/authentication';
import { addUserToDB } from '@/app/actions/user';

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
  const redirect = searchParams.get('redirect') || '/lists';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await signUp(formData);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      await addUserToDB();
      router.push(redirect);
    }
  }

  return (
    <div className="form-layout">
      <h2 className="pb-2 text-2xl font-semibold text-center xl:text-3xl">Create an account</h2>
      { // If the user was redirected from an invitation link, show this message
        redirect && owner && (
          <p className="pb-2 text-md font-semibold text-center">
            {owner.name} has invited you to collaborate on their list. Create an account to accept the invitation.
          </p>
        )
      }
      <p className="pb-4 text-md font-semibold text-center">
        Already have an account? Click
        <Link href={signInUrl} className="text-darkpink hover:text-mauve transition-colors"> here </Link>
        to sign in.
      </p>
      <hr className="border-slategray" />
      <form onSubmit={handleSubmit} className="p-4 flex flex-col">
        <label htmlFor="display-name" className="pb-1 font-semibold">Display name</label>
        <input id="display-name" name="display-name" type="text" required value={displayName} onChange={e => setDisplayName(e.target.value)}
          className="px-2 py-1 mb-6 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
        <label htmlFor="email" className="pb-1 font-semibold">Email</label>
        <input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
          onInvalid={e => { e.preventDefault(); setErrorMessage('Invalid email address'); }}
          className="px-2 py-1 mb-6 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
        <label htmlFor="password" className="pb-1 font-semibold">Password</label>
        <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
          className="px-2 py-1 mb-6 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
        <label htmlFor="password-confirmation" className="pb-1 font-semibold">Password confirmation</label>
        {!passwordMatch && confirmation && (<p className="pb-3 text-sm text-red-600 font-semibold">The passwords do not match</p>)}
        <input id="password-confirmation" type="password" required value={confirmation} onChange={e => setConfirmation(e.target.value)}
          className="px-2 py-1 mb-6 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
        <SignUpButton disabled={!formIsValid} />
        { // Alert for errors
          errorMessage && (
            <div className="modal">
              <div role="alert" className="relative px-6 py-8 w-1/5 text-center bg-snowwhite rounded-lg">
                <p className="mb-4 text-lg font-semibold">{errorMessage}</p>
                <button type="button"
                  className="px-8 py-1.5 mr-4 text-sm text-snowwhite font-semibold bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors"
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