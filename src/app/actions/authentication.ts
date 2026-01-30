'use server';

import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';

export const checkAccessCode = async (accessCode: string) => {
  const accessSecret = process.env.SIGNUP_ACCESS_SECRET;

  if (accessCode === accessSecret) {
    return { success: true };
  } else {
    return { error: 'Access denied' };
  }
}

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

export const signOut = async () => {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return { success: true };
  } catch (err: any) {
    return { error: err?.response?.data?.message || err.message || 'Sign out not successful' };
  }
}

export const updateEmail = async (formData: FormData) => {
  const email = formData.get('user-email') as string;

  try {
    await auth.api.changeEmail({
      body: {
        newEmail: email,
      },
    });

    return { success: true };
  } catch (err: any) {
    return { error: err?.response?.data?.message || err.message || 'Email update not successful' };
  }
}

export const updatePasssword = async (formData: FormData) => {
  const currentPassword = formData.get('current-password') as string;
  const newPassword = formData.get('new-password') as string;

  try {
    await auth.api.changePassword({
      body: {
        newPassword: newPassword,
        currentPassword: currentPassword,
      },
      headers: await headers(),
    });
    
    return { success: true };
  } catch (err: any) {
    return { error: err?.response?.data?.message || err.message || 'Password update not successful' };
  }
}