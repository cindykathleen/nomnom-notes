import { auth } from "@/app/lib/auth";
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import ListPage from './ListPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  return <ListPage id={id} />;
}