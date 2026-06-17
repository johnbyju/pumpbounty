'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export default function HeaderPlayerControl() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleSync = (e: CustomEvent) => {
      setIsPlaying(e.detail.isPlaying);
    };
    window.addEventListener('bounty-music-sync', handleSync as EventListener);
    
    return () => {
      window.removeEventListener('bounty-music-sync', handleSync as EventListener);
    };
  }, []);

  const togglePlay = () => {
    window.dispatchEvent(new CustomEvent('bounty-music-toggle'));
  };

  return (
    <button 
      onClick={togglePlay} 
      className="flex items-center gap-2 px-4 py-2 bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20 rounded-lg text-xs font-bold uppercase transition-colors"
    >
      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      {isPlaying ? 'Pause Theme' : 'Play Theme'}
    </button>
  );
}
