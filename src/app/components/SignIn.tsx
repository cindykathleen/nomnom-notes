import { useState } from 'react';
import { authClient } from '@/app/lib/auth-client';
import Link from 'next/link';

export const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="relative h-screen w-screen p-16 flex items-center justify-center bg-coolbeige">
      <div className="max-w-[1440px] w-full flex flex-col items-center">
        <div className="h-fit max-w-3xl px-12 py-10 bg-snowwhite rounded-3xl">
          <h2 className="pb-2 text-3xl font-semibold text-center">Sign in</h2>
          <p className="pb-4 text-md font-semibold text-center">Don't have an account? Click <Link href={'/sign-up/'} className="text-darkpink hover:text-mauve transition-colors">here</Link> to create one.</p>
          <hr className="border-slategray" />
          <div className="p-4 flex flex-col">
            <label htmlFor="email" className="pb-1 font-semibold">Email</label>
            <input id="email" type="email" required onChange={e => setEmail(e.target.value)} value={email}
              className="px-2 py-1 border border-charcoal border-solid rounded-sm mb-6 focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
            <label htmlFor="password" className="pb-1 font-semibold">Password</label>
            <input id="password" type="password" required onChange={e => setPassword(e.target.value)} value={password}
              className="px-2 py-1 border border-charcoal border-solid rounded-sm mb-6 focus:outline-none focus:border-darkpink focus:shadow-(--input-shadow)" autoComplete="off" />
            <button type="submit" disabled={loading}
              className="w-full py-2 text-snowwhite font-bold bg-darkpink rounded-lg cursor-pointer hover:bg-mauve transition-colors"
              onClick={async () => {
                await authClient.signIn.email({
                  email,
                  password,
                  callbackURL: '/lists/',
                  rememberMe: false
                }, {
                  onResponse: () => {
                    setLoading(false);
                  },
                  onRequest: () => {
                    setLoading(true);
                  },
                  onSuccess: async () => {
                    //redirect to the dashboard or sign in page
                    // router.push('/dashboard');
                  },
                  onError: (ctx) => {
                    alert(ctx.error.message);
                  },
                });
              }}>
              {loading
                ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>)
                : ("Sign in")
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}