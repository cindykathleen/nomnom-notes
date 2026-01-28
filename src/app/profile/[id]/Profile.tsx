import { User } from '@/app/interfaces/interfaces';
import Hero from './Hero';

export default async function Profile({ user }: { user: User }) {
  return (
    <div className="gated-page-layout">
      <div className="gated-page-layout-inner">
        <Hero user={user} />
        <hr className="border-lightgray" />
      </div>
    </div>
  );
}