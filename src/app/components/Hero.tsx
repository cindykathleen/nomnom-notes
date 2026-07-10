'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { requestAccess } from '@/app/actions/home';

export default function Hero() {
  const [inputEmail, setInputEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const { pending } = useFormStatus();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = await requestAccess(formData);

    if (result.error) {
      setMessage('An error occurred. Please try again.');
    } else {
      setMessage('Request sent successfully! Please allow a few days for approval.');
    }

    setInputEmail('');
  }

  const scrollToFeatures = () => {
    document.querySelector('.homepage-layout-inner')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center px-8">
      <div className="max-w-[640px] w-full flex flex-col items-center gap-4 text-center 2xl:max-w-[840px] 2xl:gap-6">
        <h1 className="2xl:text-8xl/24">Your Personal Restaurant Journal</h1>
        <p className="subheading pb-2">Record memorable dining experiences, keep track of every restaurant you've visited, and remember every dish you've loved.</p>
        <div className="max-w-[500px] w-full p-8 bg-snowwhite border border-darkpink/10 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] 2xl:max-w-[640px] 2xl:p-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="relative mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="absolute left-3 top-1/2 -translate-y-1/2 size-6 text-slategray pointer-events-none" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <input id="requestor-email" name="requestor-email" type="email" placeholder="Enter your email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)}
                className="input w-full pl-11 mb-0" autoComplete="off" />
            </div>
            <button type="submit" className="button-primary w-full">
              {pending
                ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block m-auto size-6 animate-spin" >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>)
                : ("Get access")
              }
            </button>
          </form>
          { // Display a message if it exists
            message && (
              <p className="mt-2">{message}</p>
            )
          }
        </div>
        <p className="font-light">
          Already have an access code?{" "}
          <Link href="/sign-up" className="link-cta group font-normal">
            <span>Get started now</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="size-6 transition-transform group-hover:translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </p>
      </div>
      <button type="button" onClick={scrollToFeatures} aria-label="Scroll to explore features"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slategray hover:text-darkpink transition-colors cursor-pointer">
        <span className="font-light">Scroll to explore</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
        </svg>
      </button>
    </div>
  );
}