import { useState } from 'react';
import { authClient } from '@/app/lib/auth-client';
import { useRouter } from "next/navigation";
import Link from 'next/link';

export const SignUp = () => {
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  return (
    <div className="relative h-screen p-16 sm:ml-64">
      <div className="w-1/3 m-auto px-16 py-8 border border-gray-200 rounded-3xl">
        <h2 className="pb-2 text-3xl font-semibold text-blue-900 text-center">Create an account</h2>
        <p className="pb-4 text-md font-semibold text-center">Already have an account? Click <Link href={'/sign-in/'} className="text-blue-900 hover:underline">here</Link> to sign in.</p>
        <hr className="border-gray-300" />
        <div className="p-4 flex flex-col">
          <label htmlFor="display-name" className="pb-1 font-semibold">Display name</label>
          <input id="display-name" type="text" required onChange={e => setDisplayName(e.target.value)} value={displayName}
            className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
          <label htmlFor="email" className="pb-1 font-semibold">Email</label>
          <input id="email" type="email" required onChange={e => setEmail(e.target.value)} value={email}
            className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
          <label htmlFor="password" className="pb-1 font-semibold">Password</label>
          <input id="password" type="password" required onChange={e => setPassword(e.target.value)} value={password}
            className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
          <label htmlFor="password-confirmation" className="pb-1 font-semibold">Password confirmation</label>
          <input id="password-confirmation" type="password" required onChange={e => setPasswordConfirmation(e.target.value)} value={passwordConfirmation}
            className="px-2 py-1 border border-black border-solid rounded-sm mb-6 focus:outline-none focus:border-blue-900 focus:shadow-(--input-shadow)" autoComplete="off" />
          <button type="submit" disabled={loading}
            className="px-4 py-2 self-start text-white font-bold bg-blue-900 rounded-lg cursor-pointer"
            onClick={async () => {
              await authClient.signUp.email({
                email,
                password,
                name: displayName,
                callbackURL: '/dashboard'
              }, {
                onResponse: () => {
                  setLoading(false);
                },
                onRequest: () => {
                  setLoading(true);
                },
                onSuccess: async () => {
                  //redirect to the dashboard or sign in page
                  router.push('/dashboard');
                },
                onError: (ctx) => {
                  alert(ctx.error.message);
                },
              });
            }}>
            { loading
              ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>)
              : ("Sign up")
            }
          </button>
        </div>
      </div>
    </div>
  );
}