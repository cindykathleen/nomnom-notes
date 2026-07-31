import SubmitButton from '@/app/components/SubmitButton';

interface Props {
  disabled: boolean;
}

export const SignUpButton: React.FC<Props> = ({ disabled }) => {
  return (
    <SubmitButton disabled={disabled}>
      Sign up
    </SubmitButton>
  );
}
