'use client';

import { useState } from 'react';
import { User } from '@/app/interfaces/interfaces';
import { updateUserPrivacy } from '@/app/actions/user';

export default function Profile({ user }: { user: User }) {
  const [isPrivate, setIsPrivate] = useState<boolean>(user.profilePrivacy);

  const handleChange = async (privacy: boolean) => {
    setIsPrivate(privacy);
    await updateUserPrivacy(user._id, privacy);
  }

  return (
    <div>
      <h3 className="accordion-content-heading">Set your profile privacy</h3>
      <hr className="hidden border-lightgray xl:block" />
      <div className="pt-2 flex gap-4 items-center xl:pt-8">
        <span className="text-lg">Private profile</span>
        <label className="toggle-switch">
          <input type="checkbox" checked={isPrivate} onChange={(e) => handleChange(e.target.checked)} />
          <span className="slider" />
        </label>
      </div>
    </div>
  );
}