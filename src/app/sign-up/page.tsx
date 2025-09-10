import Link from 'next/link';
import { SignUpForm } from './SignUpForm';

export default function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined }; }) {
  const redirect = searchParams?.redirect;
  const signInUrl =
    typeof redirect === 'string'
      ? `/sign-in?redirect=${encodeURIComponent(redirect)}`
      : '/sign-in';

  return (
    <div className="relative h-screen w-screen p-16 flex items-center justify-center bg-coolbeige">
      <div className="max-w-[1440px] w-full flex flex-col items-center">
        <div className="h-fit w-2xl px-12 py-10 bg-snowwhite rounded-3xl">
          <h2 className="pb-2 text-3xl font-semibold text-center">Create an account</h2>
          <p className="pb-4 text-md font-semibold text-center">
            Already have an account? Click
            <Link href={signInUrl} className="text-darkpink hover:text-mauve transition-colors"> here </Link>
            to sign in.
          </p>
          <hr className="border-slategray" />
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}