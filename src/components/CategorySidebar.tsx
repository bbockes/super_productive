import React from 'react';
export function CategorySidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  onAboutClick
}) {
  return <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Super Productive
        </h1>
        <p className="text-gray-600 text-sm mb-8">
          Tech hacks to level up your productivity
        </p>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
        <div className="space-y-2">
          {categories.map(category => <button key={category.name} onClick={() => onCategorySelect(category.name)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.name ? category.color + ' text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              {category.name}
            </button>)}
        </div>
      </div>
      <div className="mt-auto">
        <button onClick={onAboutClick} className="w-full px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
          About
        </button>
      </div>
    </aside>;
}