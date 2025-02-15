import React from 'react';
import { Menu, X } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

export default function MobileNav({ isOpen, onClose, onNavigate }: MobileNavProps) {
  const handleNavigation = (section: string) => {
    onNavigate(section);
    onClose();
  };

  return (
    <>
      <button
        className="menu-button"
        onClick={() => isOpen ? onClose() : handleNavigation('menu')}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <div className={`mobile-nav ${isOpen ? 'open' : 'closed'}`}>
        <div className="flex flex-col p-6">
          <div className="flex justify-end mb-6">
            <DarkModeToggle />
          </div>
          <div className="space-y-6">
            <button
              onClick={() => handleNavigation('features')}
              className="text-xl py-3 text-left text-gray-900 dark:text-white w-full"
            >
              Features
            </button>
            <button
              onClick={() => handleNavigation('pricing')}
              className="text-xl py-3 text-left text-gray-900 dark:text-white w-full"
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavigation('benefits')}
              className="text-xl py-3 text-left text-gray-900 dark:text-white w-full"
            >
              Benefits
            </button>
            <button
              onClick={() => handleNavigation('contact')}
              className="text-xl py-3 text-left text-gray-900 dark:text-white w-full"
            >
              Contact
            </button>
            <a
              href="/member"
              className="text-xl py-3 text-gray-900 dark:text-white block"
            >
              Member Login
            </a>
          </div>
        </div>
      </div>
    </>
  );
}