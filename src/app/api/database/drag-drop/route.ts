import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/app/lib/database';

const db = new Database('nomnom_notes');

export const GET = async (request: NextRequest) => {
  const restaurantId = request.nextUrl.searchParams.get('id');

  if (!restaurantId) {
    return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
  }

  try {
    const highestIndex = await db.getHighestDishIndex(restaurantId);

    if (!highestIndex) {
      return NextResponse.json({ error: 'Highest index not found' });
    }

    return NextResponse.json(highestIndex, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error fetching highest index: ${err}` }, { status: 500 });
  }
}

export const PUT = async (request: NextRequest) => {
  const { collectionName, dragIndex, hoverIndex } = await request.json();

  try {
      await db.moveList(collectionName, dragIndex, hoverIndex);
      return NextResponse.json({ message: 'Drag & drop implemented successfully' }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ error: `Error dragging & dropping items: ${err}` }, { status: 500 });
    }
}