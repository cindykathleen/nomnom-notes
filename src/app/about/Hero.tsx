'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { requestAccess } from '@/app/actions/about';

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

  return (
    <div className="max-w-[640px] mx-auto mt-[20vh] flex flex-col items-center gap-4 text-center xl:gap-8">
      <h1>Your Personal Restaurant Journal</h1>
      <p className="subheading pb-2">Record memorable dining experiences, keep track of every restaurant you've visited, and remember every dish you've loved.</p>
      <div className="max-w-[500px] w-full p-8 bg-snowwhite border border-lightgray rounded-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input id="requestor-email" name="requestor-email" type="email" placeholder="Enter your email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)}
            className="input flex-1 mb-2" autoComplete="off" />
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
        <p className="mt-8 font-light">
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
    </div>
  );
}