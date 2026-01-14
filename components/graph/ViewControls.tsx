"use client";

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { Grid, Layers, Map as MapIcon } from 'lucide-react';

export const ViewControls = () => {
  const viewSettings = useStore(state => state.viewSettings);
  const toggleLabels = useStore(state => state.toggleLabels);
  const toggleGridMode = useStore(state => state.toggleGridMode);
  const toggleGrid = useStore(state => state.toggleGrid);

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      <div className="flex bg-white/80 backdrop-blur shadow-sm border border-gray-200 rounded-lg p-1">
        <button
          onClick={toggleLabels}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            viewSettings.labels === 'ReIm' ? 'bg-blue-500 text-white shadow-sm' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <MapIcon size={14} />
          {viewSettings.labels === 'ReIm' ? 'Complex (Re/Im)' : 'Cartesian (X/Y)'}
        </button>
      </div>

      <div className="flex bg-white/80 backdrop-blur shadow-sm border border-gray-200 rounded-lg p-1 gap-1">
        <button
          onClick={toggleGrid}
          className={`p-2 rounded-md transition-all ${
            viewSettings.showGrid ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:bg-gray-100'
          }`}
          title="Toggle Grid Visibility"
        >
          <Grid size={18} />
        </button>
        
        <button
          onClick={toggleGridMode}
          className={`p-2 rounded-md transition-all ${
            viewSettings.mode === 'POLAR' ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:bg-gray-100'
          }`}
          title="Switch Grid Mode (Cartesian/Polar)"
        >
          <Layers size={18} />
        </button>
      </div>
    </div>
  );
};
