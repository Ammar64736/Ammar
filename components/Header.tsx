
import React from 'react';

export const Header: React.FC = () => (
  <header className="text-center">
    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
      Cinematic Angle Generator
    </h1>
    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
      Upload a scene and let AI generate six different professional camera angles of the exact same moment, preserving every detail.
    </p>
  </header>
);
