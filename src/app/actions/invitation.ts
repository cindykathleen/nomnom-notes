'use server';

import { db } from '@/app/lib/database';
import { Invitation } from "@/app/interfaces/interfaces";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const getToken = async (userId: string, listId: string) => {
  // Check if there is already a valid invitation for this list created by this user
  // To be considered valid, it must not expire for at least another 2 days
  const existingInvitation = await db.getExistingInvitation(listId);

  if (existingInvitation) {
    return existingInvitation.token;
  }

  // If there isn't, create a new one
  const token = crypto.randomBytes(16).toString('base64url');

  const newInvitation: Invitation = {
    _id: uuidv4(),
    listId: listId,
    invitedBy: userId,
    token: token,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
    usedBy: ''
  }

  try {
      await db.getToken(newInvitation);
      return token;
    } catch (err) {
      return 'Error creating invitation';
    }
}

export const checkInvitation = async (token: string) => {
  try {
    const invitation = await db.getInvitationByToken(token);

    if (!invitation) {
      return { error: 'Not a valid invitation link' };
    }

    return { success: true };
  } catch (err: any) {
    return { error: err?.response?.data?.message || err.message || 'Not a valid invitation link' };
  }
}

export const acceptInvitation = async (userId: string, token: string) => {
  try {
    await db.acceptInvitation(userId, token);
    return { success: true };
  } catch (err: any) {
    return { error: err?.response?.data?.message || err.message || 'Error accepting invitation' };
  }
}

export const declineInvitation = async (token: string) => {
  try {
    await db.declineInvitation(token);
    return { success: true };
  } catch (err: any) {
    return { error: err?.response?.data?.message || err.message || 'Error declining invitation' };
  }
}