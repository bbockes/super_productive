import React from 'react';
import { Menu, X, Bookmark, FileText } from 'lucide-react';

interface Category {
  name: string;
  color: string;
}

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onAboutClick: () => void;
  isLinkMode: boolean;
  onToggleLinkMode: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function CategorySidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  onAboutClick,
  isLinkMode,
  onToggleLinkMode,
  isMobile = false,
  onClose
}: CategorySidebarProps) {
  return (
    <div className={`${isMobile ? 'w-80' : 'w-64'} h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Categories
          </h2>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Mode Toggle */}
        <div className="mt-4 flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={onToggleLinkMode}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              !isLinkMode
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FileText size={16} className="mr-2" />
            Posts
          </button>
          <button
            onClick={onToggleLinkMode}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isLinkMode
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Bookmark size={16} className="mr-2" />
            Apps
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => onCategorySelect(category.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${category.color}`} />
                  {category.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* About Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onAboutClick}
          className="w-full px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          About
        </button>
      </div>
    </div>
  );
}