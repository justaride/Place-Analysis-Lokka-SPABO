'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface NavSection {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  sections: NavSection[];
}

export default function StickyNav({ sections }: Props) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero
      setIsVisible(window.scrollY > 400);

      // Determine active section based on scroll position
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id)
      }));

      // Find the section that's currently in view
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section?.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm animate-slide-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          {sections.map((section, index) => (
            <div key={section.id} className="flex items-center">
              <button
                onClick={() => scrollToSection(section.id)}
                className={`
                  group flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all
                  ${
                    activeSection === section.id
                      ? 'bg-lokka-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-lokka-primary'
                  }
                `}
              >
                <span className={`transition-colors ${activeSection === section.id ? 'text-white' : 'text-gray-400 group-hover:text-lokka-primary'}`}>
                  {section.icon}
                </span>
                <span className="hidden sm:inline">{section.label}</span>
              </button>
              {index < sections.length - 1 && (
                <ChevronRight className="h-4 w-4 text-gray-300 mx-1 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
