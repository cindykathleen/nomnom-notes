export default async function Hero({ stats }: {
  stats: {
    listsCount: number;
    restaurantsCount: number;
    reviewsCount: number;
  }
}) {
  return (
    <div className="profile-section">
      <h4 className="profile-section-heading">Overview</h4>
      <table className="text-lg xl:text-xl">
        <tbody>
          <tr>
            <td className="w-px pr-2 text-darkpink font-semibold">{stats.listsCount}</td>
            <td>lists</td>
          </tr>
          <tr>
            <td className="w-px pr-2 text-darkpink font-semibold">{stats.restaurantsCount}</td>
            <td>restaurants</td>
          </tr>
          <tr>
            <td className="w-px pr-2 text-darkpink font-semibold">{stats.reviewsCount}</td>
            <td>reviews</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}