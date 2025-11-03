'use client';

import { useState } from 'react';
import { User } from '@/app/interfaces/interfaces';
import { checkAccessCode } from '@/app/actions/authentication';
import { SignUpForm } from './SignUpForm';
import { SignUpAccessForm } from './SignUpAccessForm';

export const SignUpAccessGate = ({ signInUrl, owner }: { signInUrl: string, owner: User | null }) => {
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAccessFormSubmit = async (accessCode: string) => {
    const result = await checkAccessCode(accessCode);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setIsAllowed(true);
    }
  }

  return (
    <>
      { // Display the sign-up access form 
        !isAllowed && (
          <SignUpAccessForm handleAccessFormSubmit={handleAccessFormSubmit} errorMessage={errorMessage} />
        )
      }
      { // Display the sign-up form if the user has passed the access gate
        isAllowed && (
          <SignUpForm signInUrl={signInUrl} owner={owner} />
        )
      }
    </>
  );
}