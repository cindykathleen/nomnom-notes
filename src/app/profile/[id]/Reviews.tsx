import { User } from '@/app/interfaces/interfaces';

export default async function Reviews({ user }: { user: User }) {
  return (
    <div className="profile-section">
      <h4 className="profile-section-heading">Reviews</h4>
    </div>
  );
}