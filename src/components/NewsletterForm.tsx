import React, { useState, useEffect } from 'react';
import { useNewsletter } from '../hooks/useNewsletter';
import { CheckIcon, LoaderIcon } from 'lucide-react';

interface NewsletterFormProps {
  placeholder?: string;
  buttonText?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export function NewsletterForm({
  placeholder = "Get 3 new tips in your inbox every Wednesday",
  buttonText = "Subscribe",
  className = "",
  inputClassName = "",
  buttonClassName = ""
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const { isLoading, isSuccess, error, subscribe, reset } = useNewsletter();

  // Reset success state after 3 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        reset();
        setEmail('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await subscribe(email);
  };

  if (isSuccess) {
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
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className={`w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
              className={`w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !email}
            className={`px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap ${buttonClassName}`}
          >
            {isLoading && <LoaderIcon className="w-4 h-4 animate-spin" />}
            {buttonText}
          </button>
        </div>
      </form>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}