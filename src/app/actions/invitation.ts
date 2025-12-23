'use server';

import { addInvitation, getInvitationByToken, 
  acceptInvitationDb, declineInvitationDb } from '@/app/lib/dbFunctions';
import { Invitation } from "@/app/interfaces/interfaces";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const getToken = async (userId: string, listId: string) => {
  const token = crypto.randomBytes(16).toString('base64url');

  const newInvitation: Invitation = {
    _id: uuidv4(),
    listId: listId,
    invitedBy: userId,
    token: token,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Expires in 1 day
    usedBy: ''
  }

  try {
      await addInvitation(newInvitation);
      return token;
    } catch (err) {
      return 'Error creating invitation';
    }
}

export const checkInvitation = async (token: string) => {
  try {
    const invitation = await getInvitationByToken(token);

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
    await acceptInvitationDb(userId, token);
    return { success: true };
  } catch (err: any) {
    return { error: err?.response?.data?.message || err.message || 'Error accepting invitation' };
  }
}

export const declineInvitation = async (userId: string, token: string) => {
  try {
    await declineInvitationDb(userId, token);
    return { success: true };
  } catch (err: any) {
    return { error: err?.response?.data?.message || err.message || 'Error declining invitation' };
  }
}