import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface CategorySidebarProps {
  categories: Array<{ name: string; color: string }>;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onAboutClick: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function CategorySidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  onAboutClick,
  isMobile = false,
  onClose
}: CategorySidebarProps) {
  const { isDarkMode } = useTheme();
  const [logoError, setLogoError] = useState(false);

  const handleAboutClick = () => {
    onAboutClick();
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogoError = () => {
    console.error('Failed to load logo image in sidebar');
    setLogoError(true);
  };

  const getHoverClass = (categoryName: string) => {
    const hoverMap = {
      'All': 'hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-gray-800',
      'Writing': 'hover:bg-blue-500 hover:text-white dark:hover:text-gray-800',
      'Learning': 'hover:bg-red-500 hover:text-white dark:hover:text-gray-800',
      'Planning': 'hover:bg-green-500 hover:text-white dark:hover:text-gray-800',
      'Building': 'hover:bg-pink-500 hover:text-white dark:hover:text-gray-800',
      'Creativity': 'hover:bg-yellow-500 hover:text-white dark:hover:text-gray-800',
      'Growth': 'hover:bg-purple-500 hover:text-white dark:hover:text-gray-800',
      'Focus': 'hover:bg-orange-500 hover:text-white dark:hover:text-gray-800',
      'Communication': 'hover:bg-indigo-500 hover:text-white dark:hover:text-gray-800',
      'Thinking': 'hover:bg-teal-500 hover:text-white dark:hover:text-gray-800',
      'Shortcuts': 'hover:bg-emerald-500 hover:text-white dark:hover:text-gray-800'
    };
    return hoverMap[categoryName] || 'hover:bg-gray-500 hover:text-white dark:hover:text-gray-800';
  };

  const getSelectedClass = (category: { name: string; color: string }) => {
    if (category.name === 'All') {
      // Special handling for "All" button - inverse colors in dark mode
      return 'bg-gray-800 text-white dark:bg-white dark:text-gray-800';
    }
    return category.color + ' text-white';
  };

  return (
    <aside className={`${isMobile ? 'w-full h-full' : 'w-64 h-full'} bg-white dark:bg-gray-800 ${!isMobile ? 'border-r border-gray-200 dark:border-gray-700' : ''} flex flex-col overflow-hidden`}>
      {isMobile && (
        <div className="flex justify-between items-center p-6 pb-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <XIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {!isMobile && (
            <>
              {!logoError ? (
                <div className="mb-8">
                  <img 
                    src={import.meta.env.BASE_URL + (isDarkMode ? 'logo_2.png' : 'logo.png')}
                    alt="Super Productive Logo" 
                    className="max-w-full h-auto mb-2 object-contain"
                    style={{ maxHeight: '80px' }}
                    onError={handleLogoError}
                  />
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Bite-sized tech tips to level up your productivity</p>
                </div>
              ) : (
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Super Productive</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Bite-sized tech tips to level up your productivity</p>
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h2>
            </>
          )}
          
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => onCategorySelect(category.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.name 
                    ? getSelectedClass(category)
                    : `text-gray-700 dark:text-gray-300 ${getHoverClass(category.name)}`
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6 pt-0 flex-shrink-0">
        <button 
          onClick={handleAboutClick}
          className="w-full px-6 py-2 bg-transparent border-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:text-white hover:border-transparent dark:hover:border-transparent transition-colors"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#7D1FF1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          About
        </button>
      </div>
    </aside>
  );
}