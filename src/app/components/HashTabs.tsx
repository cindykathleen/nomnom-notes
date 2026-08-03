'use client';

import { ReactNode, useEffect, useState } from 'react';

export default function HashTabs({
  tabs,
  hashes,
  selectId,
}: {
  tabs: { title: string; content: ReactNode }[];
  hashes: string[];
  selectId: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const tabParam = new URLSearchParams(window.location.search).get('tab');
    const key = hash || tabParam || '';
    const index = hashes.indexOf(key);

    if (index !== -1) {
      setActiveIndex(index);
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}#${hashes[index]}`
      );
    }
    // Intentionally only sync from the URL on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (index: number) => {
    setActiveIndex(index);
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}#${hashes[index]}`
    );
  };

  return (
    <div className="tabs">
      <div className="tab-title">
        {tabs.map((tab, index) => (
          <button
            key={hashes[index]}
            type="button"
            data-cy={`tab-${hashes[index]}`}
            onClick={() => handleTabChange(index)}
            className={`flex-1 ${activeIndex === index ? 'active' : ''} xl:flex-0`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <select
        id={selectId}
        className="tab-title-select"
        value={activeIndex}
        onChange={(e) => handleTabChange(Number(e.target.value))}
      >
        {tabs.map((tab, index) => (
          <option key={hashes[index]} value={index}>
            {tab.title}
          </option>
        ))}
      </select>
      <div className="tab-content">
        {tabs.map((tab, index) => (
          <div key={hashes[index]}>
            {activeIndex === index && <div>{tab.content}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
