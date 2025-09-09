'use server';

import { db } from '@/app/lib/database';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export const getAllUsers = async (listId: string) => {
  try {
    return await db.getUsers(listId);
  } catch (err) {
    return [];
  }
}

export const addUserToDB = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    await db.addUser(session!.user.id, session!.user.name, session!.user.email);
    return { success: true };
  } catch (err) {
    return { error: `Error adding user to database: ${err}` };
  }
}

export const removeUser = async (userId: string, listId: string) => {
  try {
    await db.removeUser(userId, listId);
    revalidatePath('/lists');
    return { success: true };
  } catch (err) {
    return { error: `Error removing user from list: ${err}` };
  }
}