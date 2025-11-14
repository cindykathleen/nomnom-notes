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
    <div className="recommendation-cards">
      {recommendations.map((recommendation) => {
        const type = getDisplayType(recommendation._id);
        const imgUrl = getImgUrl(type);

        return (
          <div key={type} className='recommendation-cards-outline'>
            <p className="text-md font-semibold md:text-lg">{type}</p>
            <Image src={imgUrl} alt={`${type} food`} width={64} height={64} />
            <p className="text-lg font-semibold md:text-xl">{recommendation.restaurant.name}</p>
            <RatingDisplay rating={recommendation.restaurant.rating} />
            <div className="flex items-center text-md md:text-lg">
              <p>{getDisplayAddress(recommendation.restaurant.address)}</p>
              <p className="mx-2">|</p>
              <Link href={recommendation.restaurant.mapsUrl} target="_blank">
                <div className="group flex items-center gap-2">
                  <p className="text-md group-hover:text-mauve transition-colors">Google Maps</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="group-hover:stroke-mauve size-5 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}