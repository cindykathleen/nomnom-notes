import getDb from '@/app/lib/db';
import { User } from '@/app/interfaces/interfaces';
import Link from 'next/link';
import { SignInForm } from './SignInForm';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const db = await getDb();
  
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
    <div className="page-layout">
      <div className="page-layout-inner">
        <div className="form-layout">
          <h2 className="form-heading">Sign in</h2>
          { // If the user was redirected from an invitation link, show this message
            redirect && owner && (
              <p className="form-paragraph">
                {owner.name} has invited you to collaborate on their list. Sign in to your account to accept the invitation.
              </p>
            )
          }
          <p className="form-paragraph">
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