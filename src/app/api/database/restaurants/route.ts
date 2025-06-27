import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/app/lib/database';

const db = new Database('nomnom_notes');

export const GET = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
  }

  try {
    const restaurant = await db.getRestaurant(id);

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' });
    }

    return NextResponse.json(restaurant, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error fetching restaurant: ${err}` }, { status: 500 });
  }
}

export const POST = async (request: NextRequest) => {
  const { listId, restaurant } = await request.json();

  try {
    await db.addRestaurant(listId, restaurant);
    return NextResponse.json({ message: 'Restaurant added successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error adding restaurant: ${err}` }, { status: 500 });
  }
}

export const PUT = async (request: NextRequest) => {
  const { restaurant } = await request.json();

  try {
    await db.updateRestaurant(restaurant);
    return NextResponse.json({ message: 'Restaurant updated successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error updating restaurant: ${err}` }, { status: 500 });
  }
}

export const DELETE = async (request: NextRequest) => {
  const { listId, restaurantId } = await request.json();

  try {
    await db.deleteRestaurant(listId, restaurantId);
    return NextResponse.json({ message: 'Restaurant deleted successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error deleting restaurant: ${err}` }, { status: 500 });

  }
}