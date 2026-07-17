'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignInButton } from './SignInButton';
import { signIn } from '@/app/actions/authentication';

export const SignInForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

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
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
        className="input" autoComplete="off" />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
        className="input" autoComplete="off" />
      <SignInButton disabled={!formIsValid} />
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
  );
}