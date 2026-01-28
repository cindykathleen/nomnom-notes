import { User } from '@/app/interfaces/interfaces';

export default async function Restaurants({ user }: { user: User }) {
  return (
    <div className="profile-section">
      <h4 className="profile-section-heading">Restaurants</h4>
    </div>
  );
}