import SubmitButton from '@/app/components/SubmitButton';

interface Props {
  disabled: boolean;
}

export const SignInButton: React.FC<Props> = ({ disabled }) => {
  return (
    <SubmitButton disabled={disabled}>
      Sign in
    </SubmitButton>
  );
}
