import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/app/lib/database';

const db = new Database('nomnom_notes');

export const GET = async () => {
  try {
    const searchResult = await db.getSearchResults();

    if (!searchResult) {
      return NextResponse.json({ error: 'Search result not found' });
    }

    return NextResponse.json(searchResult, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error fetching search result: ${err}` }, { status: 500 });
  }
}

export const POST = async (request: NextRequest) => {
  const { query, places } = await request.json();

  try {
    await db.addSearchResult(query, places);
    return NextResponse.json({ message: 'Search result added successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error adding search result: ${err}` }, { status: 500 });
  }
}