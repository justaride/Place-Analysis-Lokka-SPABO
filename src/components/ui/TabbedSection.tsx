'use client';

import { useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface Props {
  tabs: Tab[];
  defaultTab?: string;
}

export default function TabbedSection({ tabs, defaultTab }: Props) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex items-center gap-2 rounded-t-lg px-4 py-3 text-sm font-medium transition-all
                ${
                  activeTab === tab.id
                    ? 'bg-white text-lokka-primary shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-lokka-primary'
                }
              `}
            >
              {tab.icon && (
                <span className={`transition-colors ${activeTab === tab.id ? 'text-lokka-primary' : 'text-gray-400 group-hover:text-lokka-primary'}`}>
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lokka-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {currentTab?.content}
      </div>
    </div>
  );
}
