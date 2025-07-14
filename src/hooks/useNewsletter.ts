import { useState } from 'react';

interface UseNewsletterReturn {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  subscribe: (email: string) => Promise<void>;
  reset: () => void;
}

export function useNewsletter(): UseNewsletterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // More permissive email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Make request to our secure Netlify function
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(), // Trim whitespace from email
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe to newsletter');
      }

      if (result.success) {
        setIsSuccess(true);
        console.log('✅ Successfully subscribed to newsletter:', email);
      } else {
        throw new Error('Unexpected response from newsletter service');
      }
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setIsSuccess(false);
  };

  return {
    isLoading,
    isSuccess,
    error,
    subscribe,
    reset,
  };
}