import { User } from '@/app/interfaces/interfaces';

export default async function Lists({ user }: { user: User }) {
  return (
    <div className="profile-section">
      <h4 className="profile-section-heading">Lists</h4>
    </div>
  );
}