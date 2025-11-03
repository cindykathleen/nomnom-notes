import { db } from '@/app/lib/database';
import { User } from '@/app/interfaces/interfaces';
import { SignUpAccessGate } from './SignUpAccessGate';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
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
    <div className="relative h-screen w-screen p-16 flex items-center justify-center bg-coolbeige">
      <div className="max-w-[1440px] w-full flex flex-col items-center">
        <SignUpAccessGate signInUrl={signInUrl} owner={owner} />
      </div>
    </div>
  );
}