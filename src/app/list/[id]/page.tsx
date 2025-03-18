import ListPage from './ListPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <ListPage id={id} />;
}