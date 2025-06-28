import React from 'react';
import { getImagePropsWithFallback } from '../utils/imageUtils';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  isModal?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * ResponsiveImage component that automatically generates responsive image props
 * using Sanity's image transformation API
 */
export function ResponsiveImage({ 
  src, 
  alt, 
  className = '', 
  isModal = false,
  style,
  onClick
}: ResponsiveImageProps) {
  const imageProps = getImagePropsWithFallback(src, alt, isModal);

  return (
    <img
      {...imageProps}
      className={className}
      style={style}
      onClick={onClick}
    />
  );
}