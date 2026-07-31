'use client';

import { useFormStatus } from 'react-dom';

interface Props {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  'data-cy'?: string;
}

export default function SubmitButton({
  children,
  disabled = false,
  className = '',
  'data-cy': dataCy,
}: Props) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`${isDisabled ? 'button-disabled' : 'button-primary'} ${className}`.trim()}
      data-cy={dataCy}
    >
      {pending
        ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block m-auto size-6 animate-spin">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        )
        : children
      }
    </button>
  );
}
