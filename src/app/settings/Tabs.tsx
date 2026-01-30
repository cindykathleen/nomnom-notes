'use client';

import { useState } from 'react';
import { User } from '@/app/interfaces/interfaces';
import Profile from './Profile';
import Email from './Email';
import Password from './Password';
import Privacy from './Privacy';

export default function Tabs({ user }: { user: User }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const tabs = [
    {
      title: 'Profile',
      content: <Profile user={user} />,
    },
    {
      title: 'Email',
      content: <Email user={user} />,
    },
    {
      title: 'Password',
      content: <Password />,
    },
    {
      title: 'Privacy',
      content: <Privacy user={user} />,
    },
  ]

  return (
    <div className="tabs">
      {/* Tabs content (desktop) */}
      <div className="tab-title">
        { tabs.map((tab, index) => (
            <button key={index} onClick={() => { setActiveIndex(index) }}
              className={`flex-1 ${activeIndex === index ? 'active' : ''} xl:flex-0`}
            >
              {tab.title}
            </button>
          ))
        }
      </div>
      {/* Tabs content (mobile) */}
      <select id="setting-select" className="tab-title-select" 
        onChange={(e) => { setActiveIndex(Number(e.target.value)) }}
      >
        { tabs.map((tab, index) => (
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