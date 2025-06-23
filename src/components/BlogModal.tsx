import React from 'react';
import { PortableText } from '@portabletext/react';
import { XIcon, ClockIcon } from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';

export function BlogModal({
  post,
  onClose
}) {
  const getCategoryColor = category => {
    const colorMap = {
      'All': 'bg-gray-800',
      'Writing': 'bg-blue-500',
      'Learning': 'bg-red-500',
      'Planning': 'bg-green-500',
      'Building': 'bg-pink-500',
      'Creativity': 'bg-yellow-500',
      'Growth': 'bg-purple-500',
      'Focus': 'bg-orange-500',
      'Communication': 'bg-indigo-500',
      'Thinking': 'bg-teal-500',
      'Shortcuts': 'bg-emerald-500'
    };
    return colorMap[category] || 'bg-gray-500';
  };

  // Format read time to always show "min" suffix
  const formatReadTime = (readTime) => {
    if (typeof readTime === 'number') {
      return `${readTime} min`;
    }
    // Handle legacy string format that might already have "min"
    if (typeof readTime === 'string') {
      return readTime.includes('min') ? readTime : `${readTime} min`;
    }
    return '5 min'; // fallback
  };

  return (
    <div 
      className="fixed inset-0 bg-white bg-opacity-70 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-2 md:p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 relative" 
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* X button positioned in top right of modal */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-4 z-10 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <XIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        
        <div className="flex-1 overflow-y-auto px-4 md:px-16 py-8">
          {/* Header content now inside scrollable area */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                <ClockIcon className="w-4 h-4" />
                {formatReadTime(post.read_time || post.readTime)}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 pt-[5px]">{post.title}</h1>
            {(post.subheader || post.excerpt) && (
              <p className="text-gray-600 dark:text-gray-400 text-lg">{post.subheader || post.excerpt}</p>
            )}
          </div>
          
          {/* Separator line */}
          <div className="border-t border-gray-200 dark:border-gray-700 mb-8"></div>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="markdown-content text-17px">
              <PortableText 
                value={post.content}
                components={{
                  block: {
                    h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-5">{children}</h3>,
                    normal: ({children}) => <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4 text-17px">{children}</p>,
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300 mb-4 text-17px">
                        {children}
                      </blockquote>
                    ),
                  },
                  marks: {
                    strong: ({children}) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
                    em: ({children}) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
                    code: ({children}) => (
                      <code className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm">
                        {children}
                      </code>
                    ),
                    link: ({children, value}) => (
                      <a 
                        href={value?.href}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  },
                  list: {
                    bullet: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                    number: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                  },
                  listItem: {
                    bullet: ({children}) => <li className="text-gray-800 dark:text-gray-200 text-17px">{children}</li>,
                    number: ({children}) => <li className="text-gray-800 dark:text-gray-200 text-17px">{children}</li>,
                  },
                  types: {
                    image: ({value}) => (
                      <img 
                        src={value?.asset?.url} 
                        alt={value?.alt || ''} 
                        className="w-full !max-w-none mx-[-10] md:mx-[-22] h-auto rounded-lg shadow-md mb-4 pt-[5px] pb-[10px]" 
                      />
                    ),
                    code: ({value}) => (
                      <pre className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-4 rounded-lg mb-4 overflow-x-auto">
                        <code className="text-sm">{value?.code}</code>
                      </pre>
                    ),
                  },
                }}
              />
              
              {/* Newsletter form for About page - placed at bottom of content */}
              {post.id === 'about' && (
                <div className="mt-6 pt-8">
                  <div style={{ width: '530px', maxWidth: '530px' }}>
                    {/* Mobile version with shorter placeholder */}
                    <div className="md:hidden">
                      <NewsletterForm 
                        className="w-full"
                        placeholder="Get free weekly updates"
                        buttonText="Subscribe"
                      />
                    </div>
                    {/* Tablet and desktop version with longer placeholder */}
                    <div className="hidden md:block">
                      <NewsletterForm 
                        className="w-full"
                        placeholder="Get 3 new tips in your inbox every Wednesday"
                        buttonText="Subscribe"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}