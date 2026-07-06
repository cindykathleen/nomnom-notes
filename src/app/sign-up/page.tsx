import { getOwnerByToken } from '@/app/lib/dbFunctions';
import { User } from '@/app/interfaces/interfaces';
import PublicNav from '@/app/components/PublicNav';
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
    owner = await getOwnerByToken(token);
  }

  return (
    <div className="outer-layout">
      <PublicNav />
      <div className="page-layout h-screen bg-coolbeige">
        <div className="page-layout-inner items-center justify-center">
          <SignUpAccessGate signInUrl={signInUrl} owner={owner} />
        </div>
      </div>
    </div>
  );
}