import { User } from '@/app/interfaces/interfaces';
import getStatistics from '@/app/lib/getStatistics';

export default async function Hero({ user }: { user: User }) {
  const listsCount = await getStatistics(user._id, 'lists');
  const restaurantsCount = await getStatistics(user._id, 'restaurants');
  const reviewsCount = await getStatistics(user._id, 'reviews');

  return (
    <div className="profile-section">
      <h4 className="profile-section-heading">Statistics</h4>
      <table className="text-md xl:text-lg">
        <tbody>
          <tr>
            <td className="w-px pr-2 text-darkpink font-semibold">{listsCount}</td>
            <td>lists</td>
          </tr>
          <tr>
            <td className="w-px pr-2 text-darkpink font-semibold">{restaurantsCount}</td>
            <td>restaurants</td>
          </tr>
          <tr>
            <td className="w-px pr-2 text-darkpink font-semibold">{reviewsCount}</td>
            <td>reviews</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}