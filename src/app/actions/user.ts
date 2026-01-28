'use server';

import { getUser, getUsers, addUserDb, updateUserDb, removeUserDb } from '@/app/lib/dbFunctions';
import { User } from "@/app/interfaces/interfaces";
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

export const updateUser = async (formData: FormData, userId: string, photoUrl: string) => {
  const name = formData.get('user-name') as string;
  const location = formData.get('user-location') as string;

  try {
    const existingUser = await getUser(userId);

    if (!existingUser) {
      return { error: 'User not found' };
    }

    const updatedUser: User = {
      ...existingUser,
      name: name,
      photoUrl: photoUrl,
      location: location,
    };

    await updateUserDb(updatedUser);
    revalidatePath('/profile/' + userId);
    return { message: 'User updated successfully' };
  } catch (err) {
    return { error: `Error updating user: ${err}` };
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