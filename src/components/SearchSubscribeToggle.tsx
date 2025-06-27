import React, { useState, useEffect } from 'react';
import { useNewsletter } from '../hooks/useNewsletter';
import { CheckIcon, LoaderIcon, SearchIcon, MailIcon } from 'lucide-react';

interface SearchSubscribeToggleProps {
  placeholder?: string;
  buttonText?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  onSearch?: (query: string) => void;
}

export function SearchSubscribeToggle({
  placeholder = "Get 3 new tips in your inbox every Wednesday",
  buttonText = "Subscribe",
  className = "",
  inputClassName = "",
  buttonClassName = "",
  onSearch
}: SearchSubscribeToggleProps) {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { isLoading, isSuccess, error, subscribe, reset } = useNewsletter();

  // Reset success state after 3 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        reset();
        setInputValue('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset]);

  // Clear input when switching modes
  useEffect(() => {
    setInputValue('');
  }, [isSearchMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, isSearchMode:', isSearchMode, 'inputValue:', inputValue);
    
    if (!isSearchMode) {
      // Handle newsletter subscription
      await subscribe(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // For search mode, trigger search immediately as user types
    if (isSearchMode && onSearch) {
      console.log('Dynamic search with query:', value);
      onSearch(value);
    }
  };

  const toggleMode = () => {
    setIsSearchMode(!isSearchMode);
    setInputValue('');
    
    // Clear search when switching from search mode
    if (isSearchMode && onSearch) {
      onSearch('');
    }
  };

  const currentPlaceholder = isSearchMode ? "Search the blog" : placeholder;
  const currentButtonText = isSearchMode ? "Search" : buttonText;

  if (isSuccess && !isSearchMode) {
    return (
      <div className={`flex items-center gap-2 text-green-600 dark:text-green-400 ${className}`}>
        <CheckIcon className="w-5 h-5" />
        <span className="font-medium">Nice! Now check your inbox to opt-in :)</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type={isSearchMode ? "text" : "email"}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={currentPlaceholder}
              disabled={isLoading}
              className={`w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
              required={!isSearchMode}
            />
          </div>
          <button
            type={isSearchMode ? "button" : "submit"}
            disabled={isLoading || (!isSearchMode && !inputValue)}
            onClick={isSearchMode ? undefined : undefined}
            className={`px-10 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 w-28 ${buttonClassName}`}
          >
            {isLoading && <LoaderIcon className="w-4 h-4 animate-spin" />}
            {isSearchMode ? "Search" : currentButtonText}
          </button>
          <button
            type="button"
            onClick={toggleMode}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex-shrink-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={isSearchMode ? "Switch to newsletter" : "Switch to search"}
          >
            {isSearchMode ? (
              <SearchIcon className="w-5 h-5" />
            ) : (
              <MailIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
      {error && !isSearchMode && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}