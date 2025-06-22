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

      // Check if we're in test mode (development environment)
      const isTestMode = import.meta.env.DEV && !import.meta.env.VITE_CONVERTKIT_API_KEY;
      
      if (isTestMode) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate different responses for testing
        if (email.includes('error')) {
          throw new Error('Test error: Invalid email address');
        }
        
        console.log('🧪 TEST MODE: Newsletter subscription simulated for:', email);
        setIsSuccess(true);
        return;
      }

      // Determine the correct URL based on environment
      // Since we're using Sanity now, we'll need to set up a different newsletter service
      // For now, we'll simulate the newsletter signup
      console.log('Newsletter signup for:', email);
      
      // You can replace this with your preferred newsletter service (ConvertKit, Mailchimp, etc.)
      // For demonstration, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSuccess(true);
    } catch (err) {
      // Handle connection errors gracefully
      if (err instanceof TypeError && err.message.includes('fetch')) {
        // This is likely a network/connection error
        console.warn('Newsletter service temporarily unavailable. Email:', email);
        setIsSuccess(true); // Show success to user for demo purposes
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