import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getUser, getProfileData, isFollowingDb } from '@/app/lib/dbFunctions';
import getCurrentUser from '@/app/lib/getCurrentUser';
import Nav from '@/app/components/Nav';
import RatingDisplay from '@/app/components/RatingDisplay';
import { ProfileItem } from '@/app/interfaces/interfaces';

const SECTIONS = {
  lists: {
    title: 'Lists',
    emptyMessage: 'The user does not have any lists.',
    countKey: 'listsCount' as const,
    itemsKey: 'lists' as const,
  },
  restaurants: {
    title: 'Restaurants',
    emptyMessage: 'The user does not have any restaurants saved.',
    countKey: 'restaurantsCount' as const,
    itemsKey: 'restaurants' as const,
  },
  reviews: {
    title: 'Reviews',
    emptyMessage: 'The user does not have any reviews.',
    countKey: 'reviewsCount' as const,
    itemsKey: 'reviews' as const,
  },
} as const;

type SectionKey = keyof typeof SECTIONS;

function ListsGrid({ items }: { items: ProfileItem[] }) {
  return (
    <div className="cards">
      {items.map((list) => (
        <Link href={`/list/${list._id}`} key={list._id} className="flex flex-col items-center gap-2">
          <Image
            src={list.photoUrl!}
            alt={list.name}
            width={300}
            height={300}
            className="aspect-square object-cover rounded-sm"
          />
          <h5>{list.name}</h5>
        </Link>
      ))}
    </div>
  );
}

function RestaurantsGrid({ items }: { items: ProfileItem[] }) {
  return (
    <div className="cards">
      {items.map((restaurant) => (
        <Link key={restaurant._id} href={`/restaurant/${restaurant._id}`} className="flex flex-col items-center gap-2">
          <Image
            src={restaurant.photoUrl!}
            alt={restaurant.name}
            width={300}
            height={300}
            className="aspect-square object-cover rounded-sm"
          />
          <h5>{restaurant.name}</h5>
        </Link>
      ))}
    </div>
  );
}

function ReviewsGrid({ items }: { items: ProfileItem[] }) {
  return (
    <div className="cards">
      {items.map((review) => (
        <div key={review._id} className="flex flex-col items-center gap-2">
          <Image src={review.photoUrl!} alt={review.name} width={300} height={300} className="aspect-square object-cover rounded-sm" />
          <div className="p-2 flex flex-col items-center gap-2">
            <h5 className="text-center">{review.name}</h5>
            <RatingDisplay rating={review.rating!} />
            <p className="description-sm whitespace-pre-line line-clamp-5">{review.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; section: string }>;
}) {
  const { id, section: sectionParam } = await params;

  if (!(sectionParam in SECTIONS)) {
    notFound();
  }

  const section = SECTIONS[sectionParam as SectionKey];
  const currentUserId = await getCurrentUser(false);
  const user = await getUser(id);

  if (!user) {
    return (
      <div className="outer-layout">
        <Nav userId={currentUserId} />
        <div className="page-layout">
          <div className="page-layout-inner gap-4 xl:gap-8">
            <h2>Uh Oh!</h2>
            <p className="subheading">We are not able to find the user you are looking for. Please double-check the user ID and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const isFollowing = await isFollowingDb(currentUserId, user._id);
  const canViewDetails =
    user.profilePrivacy !== true ||
    user._id === currentUserId ||
    isFollowing;

  if (!canViewDetails) {
    return (
      <div className="outer-layout">
        <Nav userId={currentUserId} />
        <div className="page-layout">
          <div className="page-layout-inner space-y-6 xl:space-y-8">
            <Link href={`/profile/${user._id}`} className="link-cta group font-normal">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
              </svg>
              <span className="transition-transform group-hover:translate-x-1">Back to {user.name}'s profile</span>
            </Link>
            <p className="subheading" data-cy="profile-privacy-message">
              This user turned on their profile privacy. Please request access from them.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const profileData = await getProfileData(user._id, null);
  const items = profileData[section.itemsKey];

  return (
    <div className="outer-layout">
      <Nav userId={currentUserId} />
      <div className="page-layout">
        <div className="page-layout-inner space-y-6 xl:space-y-8">
          <Link href={`/profile/${user._id}`} className="link-cta group font-normal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
            </svg>
            <span className="transition-transform group-hover:translate-x-1">Back to {user.name}'s profile</span>
          </Link>
          {items.length === 0 ? (
            <p className="subheading">{section.emptyMessage}</p>
          ) : sectionParam === 'lists' ? (
            <ListsGrid items={items} />
          ) : sectionParam === 'restaurants' ? (
            <RestaurantsGrid items={items} />
          ) : (
            <ReviewsGrid items={items} />
          )}
        </div>
      </div>
    </div>
  );
}