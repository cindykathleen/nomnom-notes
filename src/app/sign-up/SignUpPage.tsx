'use client';

import { SignUp } from '@/app/components/sign-up';
import { Sidebar } from '@/app/components/Sidebar';

export default function SignUpPage() {
  return (
    <div>
      <Sidebar />
      <SignUp />
    </div>
  );
}