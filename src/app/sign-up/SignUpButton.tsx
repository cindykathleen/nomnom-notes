import { useFormStatus } from 'react-dom';

interface Props {
  disabled: boolean;
}

export const SignUpButton: React.FC<Props> = ({ disabled }) => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={disabled}
      className={`w-full py-2 text-snowwhite font-bold rounded-lg 
      ${disabled
        ? 'bg-lightgray cursor-not-allowed'
        : 'bg-darkpink cursor-pointer hover:bg-mauve transition-colors'
      }`}>
      {pending
        ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block m-auto size-6 animate-spin" >
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>)
        : ("Sign up")
      }
    </button>
  );
}