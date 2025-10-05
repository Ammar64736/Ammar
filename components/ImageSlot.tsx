import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import type { GeneratedImage } from '../types';
import { Spinner } from './Spinner';

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export interface ImageSlotRef {
  triggerDownload: () => void;
}

interface ImageSlotProps {
  image: GeneratedImage;
  isLoading: boolean;
}

export const ImageSlot = forwardRef<ImageSlotRef, ImageSlotProps>(({ image, isLoading }, ref) => {
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [downloadFormat, setDownloadFormat] = useState('jpeg');
    const [downloadResolution, setDownloadResolution] = useState(1);

    const triggerDownload = useCallback(() => {
        if (!image.src) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scaledWidth = img.naturalWidth * downloadResolution;
            const scaledHeight = img.naturalHeight * downloadResolution;

            canvas.width = scaledWidth;
            canvas.height = scaledHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
                ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

                const mimeType = `image/${downloadFormat}`;
                const encoderOptions = (downloadFormat === 'jpeg' || downloadFormat === 'webp') ? 0.92 : undefined;
                
                const downloadFileName = `cinematic-${image.angle.toLowerCase().replace(/\s+/g, '-')}.${downloadFormat}`;

                const link = document.createElement('a');
                link.href = canvas.toDataURL(mimeType, encoderOptions);
                link.download = downloadFileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };
        img.src = image.src;
    }, [image.src, image.angle, brightness, contrast, downloadFormat, downloadResolution]);

    useImperativeHandle(ref, () => ({
      triggerDownload,
    }));

  return (
    <div className="group aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col">
      <div className="flex-grow flex items-center justify-center relative bg-black/20">
        {image.src ? (
          <>
            <img 
                src={image.src} 
                alt={image.angle} 
                className="w-full h-full object-cover transition-all duration-300" 
                style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
            />
            <div className="absolute inset-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between bg-black/40">
                <div className="self-end flex items-center gap-2">
                    <select
                        id={`format-${image.angle}`}
                        value={downloadFormat}
                        onChange={(e) => setDownloadFormat(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-black/50 text-white text-xs rounded-md p-1.5 border border-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                        aria-label="Select download format"
                    >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                    </select>
                     <select
                        id={`resolution-${image.angle}`}
                        value={downloadResolution}
                        onChange={(e) => setDownloadResolution(Number(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-black/50 text-white text-xs rounded-md p-1.5 border border-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                        aria-label="Select download resolution"
                    >
                        <option value="1">Full Size</option>
                        <option value="0.5">Half Size</option>
                        <option value="0.25">Quarter Size</option>
                    </select>
                    <button
                        onClick={triggerDownload}
                        className="p-2 bg-black/50 rounded-full text-white hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                        aria-label={`Download ${image.angle} shot`}
                        title={`Download ${image.angle} shot`}
                    >
                        <DownloadIcon />
                    </button>
                </div>

                <div className="p-2 space-y-2 bg-black/30 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <label htmlFor={`brightness-${image.angle}`} className="text-xs font-medium text-white w-16 text-left">Brightness</label>
                        <input
                            id={`brightness-${image.angle}`}
                            type="range"
                            min="50"
                            max="150"
                            value={brightness}
                            onChange={(e) => setBrightness(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-200/20 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                     <div className="flex items-center gap-3">
                        <label htmlFor={`contrast-${image.angle}`} className="text-xs font-medium text-white w-16 text-left">Contrast</label>
                        <input
                            id={`contrast-${image.angle}`}
                            type="range"
                            min="50"
                            max="150"
                            value={contrast}
                            onChange={(e) => setContrast(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-200/20 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>
          </>
        ) : isLoading ? (
          <Spinner />
        ) : (
          <div className="text-gray-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
          </div>
        )}
      </div>
      <div className="p-3 bg-gray-800 border-t border-gray-700">
        <h3 className="text-center font-semibold text-gray-300 truncate">{image.angle}</h3>
      </div>
    </div>
  );
});

ImageSlot.displayName = 'ImageSlot';
