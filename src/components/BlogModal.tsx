import React from 'react';
import { PortableText } from '@portabletext/react';
import { XIcon, ClockIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';

// Copy button component for code blocks
function CopyButton({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors group"
      title={`Copy ${filename ? filename : 'code'}`}
    >
      {copied ? (
        <CheckIcon className="w-4 h-4 text-green-400" />
      ) : (
        <CopyIcon className="w-4 h-4" />
      )}
    </button>
  );
}

// Inline code component with copy feedback
function InlineCodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const text = typeof children === 'string' ? children : children?.toString() || '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <span className="inline-code-wrapper relative inline-block group">
      <code 
        className={`px-2 py-1 rounded transition-all duration-200 cursor-pointer text-17px ${
          copied 
            ? 'bg-green-200 dark:bg-green-400 text-green-900 dark:text-gray-900' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
        }`}
        onClick={handleCopy}
        style={{ 
          fontFamily: 'inherit',
          display: 'inline-block'
        }}
      >
        "{children}"
      </code>
      <button
        onClick={handleCopy}
        className={`absolute opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-200 inline-flex items-center ${
          copied
            ? 'bg-green-200 dark:bg-green-400 text-green-700 dark:text-gray-900 opacity-100'
            : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 text-gray-600 dark:text-gray-400'
        }`}
        style={{ left: 'calc(100% + 20px)', top: '50%', transform: 'translateY(-50%)' }}
        title="Copy code"
      >
        {copied ? (
          <CheckIcon className="w-3.5 h-3.5" />
        ) : (
          <CopyIcon className="w-3.5 h-3.5" />
        )}
      </button>
    </span>
  );
}

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
      className="fixed inset-0 bg-white bg-opacity-70 dark:bg-black dark:bg-opacity-70 flex items-center justify-center py-4 md:p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-none md:rounded-xl max-w-4xl w-full max-h-full md:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 relative" 
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
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-16 py-8">
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
                    normal: ({children}) => {
                      // Check if this paragraph contains inline code
                      const childrenArray = React.Children.toArray(children);
                      const hasInlineCode = childrenArray.some(child => {
                        if (React.isValidElement(child)) {
                          // Check if this is an inline code component directly
                          if (child.type === InlineCodeBlock) return true;
                          // Check nested children for inline code
                          const nestedChildren = React.Children.toArray(child.props?.children || []);
                          return nestedChildren.some(nested => React.isValidElement(nested) && nested.type === InlineCodeBlock);
                        }
                        return false;
                      });
                      
                      return (
                        <p className={`text-gray-800 dark:text-gray-200 leading-relaxed text-17px ${hasInlineCode ? 'mb-7' : 'mb-4'}`}>
                          {children}
                        </p>
                      );
                    },
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300 mb-4 text-17px">
                        {children}
                      </blockquote>
                    ),
                  },
                  marks: {
                    strong: ({children}) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
                    em: ({children}) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
                    code: ({children}) => <InlineCodeBlock>{children}</InlineCodeBlock>,
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
                      <div className="relative mb-6">
                        {value?.filename && (
                          <div className="bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-t-lg border-b border-gray-300 dark:border-gray-500">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {value.filename}
                            </span>
                          </div>
                        )}
                        <div className="relative">
                          <pre className={`bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 ${
                            value?.filename ? 'rounded-b-lg' : 'rounded-lg'
                          } overflow-x-auto text-17px leading-relaxed`} style={{ fontFamily: 'inherit' }}>
                            <code style={{ fontFamily: 'inherit' }}>{value?.code}</code>
                          </pre>
                          <CopyButton 
                            code={value?.code || ''} 
                            filename={value?.filename}
                          />
                        </div>
                      </div>
                    ),
                    codeBlock: ({value}) => (
                      <div className="relative mb-6">
                        {value?.filename && (
                          <div className="bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-t-lg border-b border-gray-300 dark:border-gray-500">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {value.filename}
                            </span>
                          </div>
                        )}
                        <div className="relative">
                          <pre className={`bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 ${
                            value?.filename ? 'rounded-b-lg' : 'rounded-lg'
                          } overflow-x-auto text-17px leading-relaxed`} style={{ fontFamily: 'inherit' }}>
                            <code style={{ fontFamily: 'inherit' }}>{value?.code}</code>
                          </pre>
                          <CopyButton 
                            code={value?.code || ''} 
                            filename={value?.filename}
                          />
                        </div>
                      </div>
                    ),
                  },
                }}
              />
              
              {/* Newsletter form for About page - placed at bottom of content */}
              {post.id === 'about' && (
                <div className="mt-2 pt-2">
                  <div className="w-full max-w-[530px]">
                    {/* Mobile version with shorter placeholder */}
                    <div className="md:hidden">
                      <NewsletterForm 
                        className="w-full"
                        placeholder="Enter your email address"
                        buttonText="Subscribe"
                      />
                    </div>
                    {/* Tablet and desktop version with longer placeholder */}
                    <div className="hidden md:block">
                      <NewsletterForm 
                        className="w-full"
                        placeholder="Enter your email address"
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