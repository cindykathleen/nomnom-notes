'use client';

import { useState } from 'react';
import { User } from '@/app/interfaces/interfaces';
import Profile from './Profile';
import Privacy from './Privacy';

export default function Accordion({ user }: { user: User }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const accordions = [
    {
      title: 'Profile',
      content: <Profile user={user} />,
    },
    {
      title: 'Email',
      content: 'hi',
    },
    {
      title: 'Password',
      content: 'it',
    },
    {
      title: 'Privacy',
      content: <Privacy user={user} />,
    },
  ]

  return (
    <div className="accordion">
      {/* Accordion content (desktop) */}
      <div className="accordion-title">
        { accordions.map((accordion, index) => (
            <button key={index} onClick={() => { setActiveIndex(index) }}
              className={`flex-1 ${activeIndex === index ? 'active' : ''} xl:flex-0`}
            >
              {accordion.title}
            </button>
          ))
        }
      </div>
      {/* Accordion content (mobile) */}
      <select id="setting-select" className="accordion-title-select" 
        onChange={(e) => { setActiveIndex(Number(e.target.value)) }}
      >
        { accordions.map((accordion, index) => (
            <option key={index} value={index}>
              {accordion.title}
            </option>
          ))
        }
      </select>
      <div className="accordion-content">
        { // Accordion content
          accordions.map((accordion, index) => (
            <div key={index}>
              {
                activeIndex === index && (
                  <div>
                    {accordion.content}
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