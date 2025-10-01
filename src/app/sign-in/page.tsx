import { db } from '@/app/lib/database';
import { User } from '@/app/interfaces/interfaces';
import Link from 'next/link';
import { SignInForm } from './SignInForm';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const redirect = (await searchParams)?.redirect;
  const signUpUrl =
    redirect
      ? `/sign-up?redirect=${encodeURIComponent(redirect)}`
      : '/sign-up';

  let token = '';
  let owner: User | null = null;

  if (redirect) {
    token = redirect.split("/")[2];
    owner = await db.getOwnerByToken(token);
  }

  return (
    <div className="relative h-screen w-screen p-16 flex items-center justify-center bg-coolbeige">
      <div className="max-w-[1440px] w-full flex flex-col items-center">
        <div className="h-fit max-w-3xl px-12 py-10 bg-snowwhite rounded-3xl">
          <h2 className="pb-2 text-3xl font-semibold text-center">Sign in</h2>
          { // If the user was redirected from an invitation link, show this message
            redirect && owner && (
              <p className="pb-2 text-md font-semibold text-center">
                {owner.name} has invited you to collaborate on their list. Sign in to your account to accept the invitation.
              </p>
            )
          }
          <p className="pb-4 text-md font-semibold text-center">
            Don't have an account? Click
            <Link href={signUpUrl} className="text-darkpink hover:text-mauve transition-colors"> here </Link>
            to create one.
          </p>
          <hr className="border-slategray" />
          <SignInForm />
        </div>
      </div>
    </div>
  );
}