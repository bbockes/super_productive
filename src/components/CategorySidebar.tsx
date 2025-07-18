import React, { useState } from 'react';
import { XIcon, ArrowLeftRight, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getCategoryColor, getCategoryHoverClassOptimized, getCategorySelectedClass } from '../utils/categoryColorUtils';

interface SubCategory {
  name: string;
  slug: string;
}

interface BlogCategoryHierarchy {
  name: string;
  subCategories: SubCategory[];
}

interface CategorySidebarProps {
  categories: Array<{ name: string; color: string }>;
  blogCategoriesHierarchy?: BlogCategoryHierarchy[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onAboutClick: () => void;
  isLinkMode?: boolean;
  onToggleLinkMode?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function CategorySidebar({
  categories,
  blogCategoriesHierarchy,
  selectedCategory,
  onCategorySelect,
  onAboutClick,
  isLinkMode = false,
  onToggleLinkMode,
  isMobile = false,
  onClose
}: CategorySidebarProps) {
  const { isDarkMode } = useTheme();
  const [logoError, setLogoError] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Explore', 'Shape', 'Build', 'Grow']));

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

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategorySelect = (category: string) => {
    onCategorySelect(category);
    if (isMobile && onClose) {
      onClose();
    }
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
                    src={import.meta.env.BASE_URL + (isDarkMode ? 'dark_mode_logo.png' : 'logo.png')}
                    alt="Super Productive Logo" 
                    className="max-w-full h-auto mb-2 object-contain"
                    style={{ maxHeight: '80px' }}
                    onError={handleLogoError}
                  />
                  {!isLinkMode && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Bite-sized tech tips to level up your productivity</p>
                  )}
                </div>
              ) : (
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Super Productive</h1>
                  {!isLinkMode && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Bite-sized tech tips to level up your productivity</p>
                  )}
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {isLinkMode ? 'Categories' : 'Topics'}
              </h2>
            </>
          )}
          
          <div className="space-y-2">
            {isLinkMode ? (
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                Apps for...
              </div>
            ) : (
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                Posts for...
              </div>
            )}
            
            {/* All button */}
            <button
              onClick={() => handleCategorySelect('All')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === 'All' 
                  ? getCategorySelectedClass({ name: 'All', color: 'bg-gray-800' }, isDarkMode)
                  : `text-gray-700 dark:text-gray-300 ${getCategoryHoverClassOptimized('All')}`
              }`}
            >
              {isLinkMode ? '→ Every Use-Case' : '→ Every Topic'}
            </button>
            
            {/* Blog categories hierarchy or link categories */}
            {isLinkMode ? (
              // Original link categories
              categories.slice(1).map(category => (
                <button
                  key={category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.name 
                      ? getCategorySelectedClass(category, isDarkMode)
                      : `text-gray-700 dark:text-gray-300 ${getCategoryHoverClassOptimized(category.name)}`
                  }`}
                >
                  {category.name}
                </button>
              ))
            ) : (
              // Blog categories hierarchy
              blogCategoriesHierarchy?.map(mainCategory => (
                <div key={mainCategory.name} className="mb-2">
                  <button
                    onClick={() => toggleCategory(mainCategory.name)}
                    className="w-full flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    <span>{mainCategory.name}</span>
                    {expandedCategories.has(mainCategory.name) ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </button>
                  
                  {expandedCategories.has(mainCategory.name) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {mainCategory.subCategories.map(subCategory => (
                        <button
                          key={subCategory.slug}
                          onClick={() => handleCategorySelect(subCategory.slug)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            selectedCategory === subCategory.slug 
                              ? getCategorySelectedClass({ name: subCategory.name, color: getCategoryColor(subCategory.name) }, isDarkMode)
                              : `text-gray-600 dark:text-gray-400 ${getCategoryHoverClassOptimized(subCategory.name)}`
                          }`}
                        >
                          {subCategory.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 flex-shrink-0">
        {/* About Button */}
        <button 
          onClick={handleAboutClick}
          className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-700 dark:hover:text-white transition-all duration-200"
        >
          About
        </button>

        {/* Mode Toggle Button */}
        {onToggleLinkMode && (
          <button
            onClick={onToggleLinkMode}
            className="w-full mt-3 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeftRight className="w-4 h-4" />
            {isLinkMode ? 'Posts' : 'Apps'}
          </button>
        )}
      </div>
    </aside>
  );
}