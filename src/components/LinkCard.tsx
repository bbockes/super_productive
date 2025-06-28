import React from 'react';
import { ExternalLinkIcon } from 'lucide-react';
import { ResponsiveImage } from './ResponsiveImage';

interface LinkCardProps {
  linkCard: {
    _id: string;
    title: string;
    image: string;
    url: string;
    category?: string;
  };
}

export function LinkCard({ linkCard }: LinkCardProps) {
  const handleClick = () => {
    window.open(linkCard.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-gray-900 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-200 group relative"
    >
      <div className="aspect-video bg-gray-800 dark:bg-gray-700 relative">
        <ResponsiveImage
          src={linkCard.image} 
          alt={linkCard.title} 
          className="w-full h-full object-cover" 
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-85 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-3 px-4">
            <span className="text-white font-medium text-17px text-center leading-relaxed">
              {linkCard.title}
            </span>
            <ExternalLinkIcon className="w-6 h-6 text-white flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}