import Image from 'next/image';
import { User } from '@/app/interfaces/interfaces';

export default async function Photos({ user }: { user: User }) {
  const randomPhotos = user.photos
    .slice() // make a copy of the array
    .sort(() => 0.5 - Math.random())
    .slice(0, 9); // choose at most 9 photos

  return (
    <div className="profile-section">
      <h4 className="profile-section-heading">Photos</h4>
      <div className="profile-section-photos">
       {
        randomPhotos.length > 0 && (
          randomPhotos.map((photo, index) => (
            <Image key={index} src={photo} alt={`${user.name}'s photo`} width='200' height='200' 
              className="aspect-square object-cover rounded-sm"
            />
          ))
        )
       }
      </div>
    </div>
  );
}