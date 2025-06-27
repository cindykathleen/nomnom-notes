import { NextResponse } from 'next/server';
import { Database } from '@/app/lib/database';

const db = new Database('nomnom_notes');

export const GET = async () => {
  try {
    const lists = await db.getLists();

    if (!lists) {
      return NextResponse.json({ error: 'Lists not found' });
    }

    return NextResponse.json(lists, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error fetching lists: ${err}` }, { status: 500 });
  }
}