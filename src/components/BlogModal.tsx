import React from 'react';
import { XIcon, ClockIcon } from 'lucide-react';
export function BlogModal({
  post,
  onClose
}) {
  const getCategoryColor = category => {
    const colorMap = {
      Sales: 'bg-blue-500',
      Content: 'bg-red-500',
      SEO: 'bg-green-500',
      Social: 'bg-pink-500',
      Ads: 'bg-yellow-500',
      Copywriting: 'bg-purple-500',
      'Landing Page': 'bg-orange-500',
      Brand: 'bg-indigo-500',
      Creative: 'bg-teal-500'
    };
    return colorMap[category] || 'bg-gray-500';
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-8 border-b relative">
          <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100">
            <XIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <ClockIcon className="w-4 h-4" />
              {post.readTime}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg mb-6">{post.excerpt}</p>
            <div className="text-gray-800 leading-relaxed space-y-4">
              {post.content.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
}