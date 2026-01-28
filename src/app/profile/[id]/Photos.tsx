import { User } from '@/app/interfaces/interfaces';

export default async function Photos({ user }: { user: User }) {
  return (
    <div className="profile-section">
      <h4 className="profile-section-heading">Photos</h4>
    </div>
  );
}