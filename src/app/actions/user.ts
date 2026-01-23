'use server';

import { getUsers, addUserDb, removeUserDb } from '@/app/lib/dbFunctions';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';


export const getAllUsers = async (listId: string) => {
  try {
    return await getUsers(listId);
  } catch (err) {
    return [];
  }
}

export const addUser = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    await addUserDb(session!.user.id, session!.user.name, session!.user.email);
    return { success: true };
  } catch (err) {
    return { error: `Error adding user to database: ${err}` };
  }
}

export const removeUser = async (userId: string, listId: string) => {
  try {
    await removeUserDb(userId, listId);
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: `Error removing user from list: ${err}` };
  }
}