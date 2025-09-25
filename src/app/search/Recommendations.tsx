import { Recommendation } from '@/app/interfaces/interfaces';
import RatingDisplay from '@/app/components/RatingDisplay';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchResults({ recommendations }: { recommendations: Recommendation[] }) {
  const getDisplayType = (type: string) => {
    return type.replace(/\s*restaurant$/i, '').trim();
  }

  const getImgUrl = (type: string) => {
    const cuisine = type.toLowerCase();
    return `/icons/recommendation_${cuisine}_256x256.png`;
  }

  const getDisplayAddress = (address: string) => {
    const match = address.match(/,\s*([^,]+),\s*([A-Z]{2})/);

    if (match) {
      const displayAddress = `${match[1]}, ${match[2]}`;
      return displayAddress;
    }

    return address;
  }

  return (
    <div className="grid grid-cols-3 gap-y-16">
      {recommendations.map((recommendation) => {
        const type = getDisplayType(recommendation._id);
        const imgUrl = getImgUrl(type);

        return (
          <div key={type}
            className={`px-4 py-8 flex flex-col justify-center items-center gap-2 text-center
              [&:nth-child(3n+1)]:border-r [&:nth-child(3n+2)]:border-r border-lightgray`}>
            <p className="text-lg font-semibold">{type}</p>
            <Image src={imgUrl} alt={`${type} food`} width={64} height={64} />
            <p className="text-xl font-semibold">{recommendation.restaurant.name}</p>
            <RatingDisplay rating={recommendation.restaurant.rating} />
            <p className="text-lg">
              {getDisplayAddress(recommendation.restaurant.address)} 
              <span className="mx-2">|</span>
              <Link href={recommendation.restaurant.mapsUrl} target="_blank"
                className="hover:text-mauve transition-colors">
                Google Maps
              </Link>
            </p>
          </div>
        );
      })}
    </div>
  );
}