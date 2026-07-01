'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';

export default function Hero() {
  const [inputEmail, setInputEmail] = useState('');
  
  const { pending } = useFormStatus();

  return (
    <div className="h-full grid grid-cols-2 place-content-center gap-8 xl:gap-12">
      <div className="flex flex-col justify-center gap-4 xl:gap-8">
        <h1 className="page-heading">Your Personal Restaurant Journal</h1>
        <p className="page-subheading">Record memorable dining experiences, keep track of every restaurant you've visited, and remember every dish you've loved.</p>
        <form className="flex gap-2">
          <input id="requestor-email" name="requestor-email" type="email" placeholder="Enter your email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)}
            className="input flex-1" autoComplete="off" />
          <button type="submit" className="button-primary shrink-0 whitespace-nowrap" data-cy="edit-email-submit">
            {pending
              ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block m-auto size-6 animate-spin" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>)
              : ("Get access")
            }
          </button>
        </form>
      </div>
      <div className="flex items-center">
        <img src="https://placehold.co/800" />
      </div>
    </div>
  );
}