'use server';

import { transporter } from '@/app/lib/mailer';

export async function requestAccess(formData: FormData) {
  const email = formData.get('requestor-email') as string;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "NomNom Notes - New Request Access",
      text: `${email} requested access.`,
    });

    return { success: true };
  } catch (err: any) {
    return { error: err?.response?.data?.message || err.message || 'Request not successful' };
  }
}