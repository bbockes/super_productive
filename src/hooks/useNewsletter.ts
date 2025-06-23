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
      // Validate email on client side
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Make request to our secure Netlify function
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
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
      
      // Handle network errors gracefully
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Unable to connect to newsletter service. Please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
  };

  return {
    isLoading,
    isSuccess,
    error,
    subscribe,
    reset,
  };
}