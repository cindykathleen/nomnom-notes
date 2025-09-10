import Link from 'next/link';
import { SignInForm } from './SignInForm';

export default function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined }; }) {
  const redirect = searchParams?.redirect;
  const signUpUrl =
    typeof redirect === 'string'
      ? `/sign-up?redirect=${encodeURIComponent(redirect)}`
      : '/sign-up';

  return (
    <div className="relative h-screen w-screen p-16 flex items-center justify-center bg-coolbeige">
      <div className="max-w-[1440px] w-full flex flex-col items-center">
        <div className="h-fit w-2xl px-12 py-10 bg-snowwhite rounded-3xl">
          <h2 className="pb-2 text-3xl font-semibold text-center">Sign in</h2>
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