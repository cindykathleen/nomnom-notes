import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/app/lib/database';

const db = new Database('nomnom_notes');

export const GET = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
  }

  try {
    const dish = await db.getDish(id);

    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' });
    }

    return NextResponse.json(dish, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error fetching dish: ${err}` }, { status: 500 });
  }
}

export const POST = async (request: NextRequest) => {
  const { restaurantId, dish } = await request.json();

  try {
    await db.addDish(restaurantId, dish);
    return NextResponse.json({ message: 'Dish added successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error adding dish: ${err}` }, { status: 500 });
  }
}

export const PUT = async (request: NextRequest) => {
  const { dish } = await request.json();

  try {
    await db.updateDish(dish);
    return NextResponse.json({ message: 'Dish updated successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error updating dish: ${err}` }, { status: 500 });
  }
}

export const DELETE = async (request: NextRequest) => {
  const { restaurantId, dishId } = await request.json();

  try {
    await db.deleteDish(restaurantId, dishId);
    return NextResponse.json({ message: 'Dish deleted successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Error deleting dish: ${err}` }, { status: 500 });

  }
}