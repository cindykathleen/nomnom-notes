import getDb from '@/app/lib/db';
import { User } from '@/app/interfaces/interfaces';
import { SignUpAccessGate } from './SignUpAccessGate';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const db = await getDb();
  
  // Handle redirect
  const redirect = (await searchParams)?.redirect;
  const signInUrl =
    redirect
      ? `/sign-in?redirect=${encodeURIComponent(redirect)}`
      : '/sign-in';

  let token = '';
  let owner: User | null = null;

  if (redirect) {
    token = redirect.split("/")[2];
    owner = await db.getOwnerByToken(token);
  }

  return (
    <div className="page-layout">
      <div className="page-layout-inner">
        <SignUpAccessGate signInUrl={signInUrl} owner={owner} />
      </div>
    </div>
  );
}