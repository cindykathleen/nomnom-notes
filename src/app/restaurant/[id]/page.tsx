import RestaurantPage from './RestaurantPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <RestaurantPage id={id} />;
}
