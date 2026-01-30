'use client';

import { useState, useEffect } from 'react';
import { User } from '@/app/interfaces/interfaces';
import Profile from './Profile';
import Email from './Email';
import Password from './Password';
import Privacy from './Privacy';

export default function Tabs({ user }: { user: User }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const tabs = [
    { title: 'Profile', content: <Profile user={user} /> },
    { title: 'Email', content: <Email user={user} /> },
    { title: 'Password', content: <Password /> },
    { title: 'Privacy', content: <Privacy user={user} /> },
  ];

  const TAB_HASHES = ['profile', 'email', 'password', 'privacy'];

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const index = TAB_HASHES.indexOf(hash);

    if (index !== -1) {
      setActiveIndex(index);
    }
  }, []);

  const handleTabChange = (index: number) => {
    setActiveIndex(index);
    window.history.replaceState(null, '', `#${TAB_HASHES[index]}`);
  }

  return (
    <div className="tabs">
      {/* Tabs content (desktop) */}
      <div className="tab-title">
        {tabs.map((tab, index) => (
          <button key={index} onClick={() => { handleTabChange(index) }}
            className={`flex-1 ${activeIndex === index ? 'active' : ''} xl:flex-0`}
          >
            {tab.title}
          </button>
        ))
        }
      </div>
      {/* Tabs content (mobile) */}
      <select id="setting-select" className="tab-title-select"
        onChange={(e) => { handleTabChange(Number(e.target.value)) }}
      >
        {tabs.map((tab, index) => (
          <option key={index} value={index}>
            {tab.title}
          </option>
        ))
        }
      </select>
      <div className="tab-content">
        { // Tabs content
          tabs.map((tab, index) => (
            <div key={index}>
              {
                activeIndex === index && (
                  <div>
                    {tab.content}
                  </div>
                )
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}