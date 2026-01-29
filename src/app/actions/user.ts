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
    revalidatePath('/settings/');
    return { message: 'User updated successfully' };
  } catch (err) {
    return { error: `Error updating user: ${err}` };
  }
}

export const updateUserPrivacy = async (userId: string, profilePrivacy: boolean) => {
  try {
    const existingUser = await getUser(userId);

    if (!existingUser) {
      return { error: 'User not found' };
    }

    const updatedUser: User = {
      ...existingUser,
      profilePrivacy: profilePrivacy,
    };

    await updateUserDb(updatedUser);
    revalidatePath('/settings/#privacy');
    return { message: 'User privacy updated successfully' };
  } catch (err) {
    return { error: `Error updating user privacy: ${err}` };
  }
}

export const updateUserEmail = async (formData: FormData, userId: string) => {
  const email = formData.get('user-email') as string;

  try {
    const existingUser = await getUser(userId);

    if (!existingUser) {
      return { error: 'User not found' };
    }

    const updatedUser: User = {
      ...existingUser,
      email: email,
    };

    await updateUserDb(updatedUser);
    revalidatePath('/settings/#email');
    return { message: 'User email updated successfully' };
  } catch (err) {
    return { error: `Error updating user email: ${err}` };
  }
}

export const addPhotoToUser = async (userId: string, photoUrl: string) => {
  try {
    const user = await getUser(userId);

    if (!user) {
      return { error: 'User not found' };
    }

    const updatedPhotos = user.photos ? [...user.photos, photoUrl] : [photoUrl];

    const updatedUser: User = {
      ...user,
      photos: updatedPhotos,
    };

    await updateUserDb(updatedUser);
    return { message: 'Photo added to user successfully' };
  } catch (err) {
    return { error: `Error adding photo to user: ${err}` };
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