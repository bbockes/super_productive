import React, { useState } from 'react';
import { BlogCard } from './BlogCard';
import { BlogModal } from './BlogModal';
import { CategorySidebar } from './CategorySidebar';
import { blogPosts, categories, aboutPost } from '../data/blogData';
import { LinkedinIcon, LinkIcon } from 'lucide-react';
export function BlogLayout() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const filteredPosts = selectedCategory === 'All' ? blogPosts : blogPosts.filter(post => post.category === selectedCategory);
  const handlePostClick = post => {
    setSelectedPost(post);
  };
  const handleAboutClick = () => {
    setSelectedPost(aboutPost);
  };
  const handleCloseModal = () => {
    setSelectedPost(null);
  };
  return <div className="flex min-h-screen">
      <CategorySidebar categories={categories} selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} onAboutClick={handleAboutClick} />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
              <div className="flex items-center gap-6">
                <input type="email" placeholder="Never miss a post. Subscribe for free updates" className="w-96 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
              <div className="flex gap-4">
                <a href="https://bsky.app" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                  <LinkIcon className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map(post => <BlogCard key={post.id} post={post} onClick={() => handlePostClick(post)} />)}
          </div>
        </div>
      </main>
      {selectedPost && <BlogModal post={selectedPost} onClose={handleCloseModal} />}
    </div>;
}