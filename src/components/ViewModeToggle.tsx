import React from 'react';
import { BookOpenIcon, LinkIcon } from 'lucide-react';

interface ViewModeToggleProps {
  isLinkMode: boolean;
  onToggle: () => void;
}

export function ViewModeToggle({ isLinkMode, onToggle }: ViewModeToggleProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm flex items-center">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
          !isLinkMode
            ? 'bg-blue-500 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <BookOpenIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Articles</span>
      </button>
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
          isLinkMode
            ? 'bg-blue-500 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <LinkIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Links</span>
      </button>
    </div>
  );
}