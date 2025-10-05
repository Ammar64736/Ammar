
import React from 'react';
import type { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

const RestoreIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a9 9 0 0114.13-6.364M20 15a9 9 0 01-14.13 6.364" />
    </svg>
);

const DeleteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const HistoryItemCard: React.FC<{ item: HistoryItem, onRestore: (id: string) => void, onDelete: (id: string) => void }> = ({ item, onRestore, onDelete }) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    }).format(item.timestamp);
    
    return (
        <div className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg aspect-w-16 aspect-h-9">
            <img src={item.sourceImage} alt="History thumbnail" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-white">
                <div className="self-end flex items-center gap-2">
                     <button
                        onClick={() => onRestore(item.id)}
                        className="p-2 bg-black/50 rounded-full text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                        aria-label="Restore this session"
                        title="Restore"
                    >
                        <RestoreIcon />
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 bg-black/50 rounded-full text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
                        aria-label="Delete this session"
                        title="Delete"
                    >
                        <DeleteIcon />
                    </button>
                </div>
                <p className="text-xs font-semibold self-start bg-black/40 px-2 py-1 rounded">
                    {formattedDate}
                </p>
            </div>
        </div>
    );
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onRestore, onDelete }) => {
  if (history.length === 0) {
    return null;
  }
    
  return (
    <section aria-labelledby="history-heading">
        <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 id="history-heading" className="text-3xl font-bold text-gray-300">Generation History</h2>
            <p className="mt-2 text-gray-400">Review, restore, or delete your past creations.</p>
        </div>
        {history.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {history.map(item => (
                    <HistoryItemCard key={item.id} item={item} onRestore={onRestore} onDelete={onDelete} />
                ))}
            </div>
        ) : (
            <div className="text-center py-12 px-6 bg-gray-800 rounded-lg">
                <p className="text-gray-500">Your generated images will appear here.</p>
            </div>
        )}
    </section>
  );
};
