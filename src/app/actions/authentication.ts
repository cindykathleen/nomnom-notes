'use server';

import { auth } from '@/app/lib/auth';


export const signUp = async (formData: FormData) => {
  const name = formData.get('display-name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await auth.api.signUpEmail({
      body: {
        name: name,
        email: email,
        password: password,
      },
    });

    return { success: true };
  } catch (err: any) {
    return { error: err?.response?.data?.message || err.message || 'Sign up not successful' };
  }
}

export const signIn = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      }
    });

    return { success: true };
  } catch (err: any) {
    return { error: err?.response?.data?.message || err.message || 'Sign in not successful' };
  }
}