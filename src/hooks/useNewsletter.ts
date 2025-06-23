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

      // Get ConvertKit credentials from environment
      const apiKey = import.meta.env.VITE_CONVERTKIT_API_KEY;
      const formId = import.meta.env.VITE_CONVERTKIT_FORM_ID;

      if (!apiKey || !formId) {
        throw new Error('Newsletter service configuration is missing');
      }

      // Make request to ConvertKit API
      const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          email: email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific ConvertKit error messages
        if (response.status === 400) {
          throw new Error('Invalid email address or already subscribed');
        } else if (response.status === 401) {
          throw new Error('Newsletter service authentication failed');
        } else if (response.status === 422) {
          throw new Error('Email address is invalid');
        } else {
          throw new Error(errorData.message || 'Failed to subscribe to newsletter');
        }
      }

      const result = await response.json();
      
      // ConvertKit returns a subscription object on success
      if (result.subscription) {
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