import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/app/lib/database';

const db = new Database('nomnom_notes');

export const GET = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get('id');
  const restaurantId = request.nextUrl.searchParams.get('restaurantId');

  try {
    let list = null;

    if (id) {
      list = await db.getList(id);
    } else if (restaurantId) {
      list = await db.getListByRestaurantId(restaurantId);
    } else {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }

    if (!list) {
      return NextResponse.json({ error: 'List not found' });
    }

    return NextResponse.json(list, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error fetching list: ${err}` }, { status: 500 });
  }
}

export const POST = async (request: NextRequest) => {
  const { list } = await request.json();

  try {
    await db.addList(list);
    return NextResponse.json({ message: 'List added successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error adding list: ${err}` }, { status: 500 });
  }
}

export const PUT = async (request: NextRequest) => {
  const { list } = await request.json();

  try {
    const existingList = await db.getList(list._id);

    if (!existingList) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    const updatedList = {
      ...list,
      restaurants: existingList.restaurants
    };

    await db.updateList(updatedList);
    return NextResponse.json({ message: 'List updated successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error updating list: ${err}` }, { status: 500 });
  }
}

export const DELETE = async (request: NextRequest) => {
  const { id } = await request.json();

  try {
    await db.deleteList(id);
    return NextResponse.json({ message: 'List deleted successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error deleting list: ${err}` }, { status: 500 });

  }
}