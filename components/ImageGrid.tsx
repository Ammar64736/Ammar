import React, { useRef } from 'react';
import type { GeneratedImage } from '../types';
import { ImageSlot, type ImageSlotRef } from './ImageSlot';

interface ImageGridProps {
  images: GeneratedImage[];
  isLoading: boolean;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, isLoading }) => {
  const imageSlotRefs = useRef<Array<React.RefObject<ImageSlotRef>>>([]);
  imageSlotRefs.current = images.map((_, i) => imageSlotRefs.current[i] ?? React.createRef());
  
  const handleDownloadAll = () => {
    imageSlotRefs.current.forEach(ref => {
      ref.current?.triggerDownload();
    });
  };
  
  const canDownloadAny = !isLoading && images.some(img => img.src);

  return (
    <>
      {canDownloadAny && (
        <div className="text-center mb-8">
            <button
              onClick={handleDownloadAll}
              disabled={!canDownloadAny}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Download All
            </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {images.map((image, index) => (
          <ImageSlot 
            key={index} 
            ref={imageSlotRefs.current[index]} 
            image={image} 
            isLoading={isLoading} 
          />
        ))}
      </div>
    </>
  );
};
