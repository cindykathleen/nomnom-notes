'use client';

import { SignIn } from '@/app/components/sign-in';
import { Sidebar } from '@/app/components/Sidebar';

export default function SignInPage() {
  return (
    <div>
      <Sidebar />
      <SignIn />
    </div>
  );
}