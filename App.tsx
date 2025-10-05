
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageGrid } from './components/ImageGrid';
import { HistoryPanel } from './components/HistoryPanel';
import { generateCinematicAngle } from './services/geminiService';
import { CAMERA_ANGLES } from './constants';
import type { GeneratedImage, HistoryItem } from './types';

const createThumbnail = (
  base64String: string | null,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.7
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (!base64String) {
      return resolve(null);
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round(width * (maxHeight / height));
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Image failed to load for thumbnail creation'));
    img.src = base64String;
  });
};


const App: React.FC = () => {
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>(
    CAMERA_ANGLES.map(angle => ({ angle: angle.name, src: null }))
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadHistory = (): HistoryItem[] => {
    try {
      const savedHistory = localStorage.getItem('generationHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      return [];
    }
  };

  const saveHistory = (historyItems: HistoryItem[]) => {
    try {
      localStorage.setItem('generationHistory', JSON.stringify(historyItems));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  };
  
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleImageUpload = (file: File) => {
    setSourceImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSourceImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setGeneratedImages(CAMERA_ANGLES.map(angle => ({ angle: angle.name, src: null })));
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!sourceImageFile || !sourceImagePreview) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(CAMERA_ANGLES.map(angle => ({ angle: angle.name, src: null })));

    const base64Data = sourceImagePreview.split(',')[1];
    const mimeType = sourceImageFile.type;

    try {
      const imageGenerationPromises = CAMERA_ANGLES.map(async (angle) => {
        const imageData = await generateCinematicAngle(base64Data, mimeType, angle.description);
        return {
          angle: angle.name,
          src: imageData ? `data:image/jpeg;base64,${imageData}` : null,
        };
      });

      const results = await Promise.all(imageGenerationPromises);
      
      setGeneratedImages(results);

      // Create compressed thumbnails for history to avoid storage quota errors
      const sourceThumbnail = await createThumbnail(sourceImagePreview, 800, 800, 0.8);
      
      const generatedThumbnailsPromises = results.map(async (result) => {
          const thumbSrc = await createThumbnail(result.src, 400, 400, 0.7);
          return { ...result, src: thumbSrc };
      });
      const generatedThumbnails = await Promise.all(generatedThumbnailsPromises);

      const newHistoryItem: HistoryItem = {
        id: `gen-${Date.now()}`,
        sourceImage: sourceThumbnail!,
        generatedImages: generatedThumbnails,
        timestamp: Date.now(),
      };

      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      saveHistory(updatedHistory);

    } catch (err) {
      console.error("Error generating images:", err);
      setError("An error occurred while generating images. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  }, [sourceImageFile, sourceImagePreview, history]);

  const handleRestoreHistory = (id: string) => {
    const item = history.find(h => h.id === id);
    if (item) {
      setSourceImageFile(null); // Can't restore the file object
      setSourceImagePreview(item.sourceImage);
      setGeneratedImages(item.generatedImages);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteHistory = (id: string) => {
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mt-8">
          <ImageUploader onImageSelect={handleImageUpload} previewUrl={sourceImagePreview} />
          
          <div className="mt-6 text-center">
            <button
              onClick={handleGenerateClick}
              disabled={isLoading || !sourceImageFile}
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
              {isLoading ? 'Generating Angles...' : 'Generate Cinematic Angles'}
            </button>
          </div>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg text-center">
            <p>{error}</p>
          </div>
        )}
        
        <div className="mt-12">
           <ImageGrid images={generatedImages} isLoading={isLoading} />
        </div>

        <div className="mt-16">
          <HistoryPanel 
            history={history}
            onRestore={handleRestoreHistory}
            onDelete={handleDeleteHistory}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
