'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignUpButton } from '@/app/components/SignUpButton';
import { signUp } from '@/app/actions/actions';

export const SignUpForm = () => {
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmation, setConfirmation] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const passwordMatch = password === confirmation;

  const formIsValid =
    displayName.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmation.trim() !== '' &&
    passwordMatch;

  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const result = await signUp(formData);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      router.push('/lists');
    }
  }

  return (
    <form action={formData => { handleSubmit(formData) }} className="p-4 flex flex-col">
      <label htmlFor="display-name" className="pb-1 font-semibold">Display name</label>
      <input id="display-name" name="display-name" type="text" required value={displayName} onChange={e => setDisplayName(e.target.value)}
        className="px-2 py-1 mb-6 border border-charcoal rounded-sm focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
      <label htmlFor="email" className="pb-1 font-semibold">Email</label>
      <input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
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
          <div className="fixed flex items-center justify-center inset-0 w-full h-full bg-(--modal-background)">
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
  );
}