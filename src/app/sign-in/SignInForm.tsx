'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignInButton } from './SignInButton';
import { signIn } from '@/app/actions/authentication';

export const SignInForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const formIsValid =
    email.trim() !== '' &&
    password.trim() !== '';

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await signIn(formData);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      router.push(redirect);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col">
      <label htmlFor="email" className="pb-1 font-semibold">Email</label>
      <input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
        className="input" autoComplete="off" />
      <label htmlFor="password" className="pb-1 font-semibold">Password</label>
      <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
        className="input" autoComplete="off" />
      <SignInButton disabled={!formIsValid} />
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
  );
}