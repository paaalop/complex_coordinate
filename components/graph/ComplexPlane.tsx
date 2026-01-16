"use client";

import React from 'react';
import { Mafs, Coordinates, Text } from 'mafs';
import { useStore } from '@/lib/store/useStore';
import { PlotLayer } from './PlotLayer';
import { PolarGrid } from './PolarGrid';
import { ViewTracker } from './ViewTracker';

export const ComplexPlane = () => {
  const viewSettings = useStore(state => state.viewSettings);
  const setViewSettings = useStore(state => state.setViewSettings);
  
  const xLabel = viewSettings.labels === 'ReIm' ? 'Re' : 'x';
  const yLabel = viewSettings.labels === 'ReIm' ? 'Im' : 'y';

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const ZOOM_SENSITIVITY = 0.0005; // Adjust for sensitivity
    const delta = e.deltaY;
    const scale = 1 + delta * ZOOM_SENSITIVITY;

    // Zoom towards center for simplicity in this fix (can be improved to zoom to mouse later)
    const xRange = viewSettings.xMax - viewSettings.xMin;
    const yRange = viewSettings.yMax - viewSettings.yMin;
    const xMid = (viewSettings.xMin + viewSettings.xMax) / 2;
    const yMid = (viewSettings.yMin + viewSettings.yMax) / 2;

    const newXRange = xRange * scale;
    const newYRange = yRange * scale;

    setViewSettings({
      xMin: xMid - newXRange / 2,
      xMax: xMid + newXRange / 2,
      yMin: yMid - newYRange / 2,
      yMax: yMid + newYRange / 2,
    });
  };

  return (
    <div 
      className="w-full h-full min-h-[500px] border border-gray-200 rounded-lg overflow-hidden bg-white"
      onWheel={handleWheel}
    >
      <Mafs
        viewBox={{
            x: [viewSettings.xMin, viewSettings.xMax],
            y: [viewSettings.yMin, viewSettings.yMax],
            // Padding removed to prevent loop with ViewTracker
        }}
        preserveAspectRatio={false}
        pan={true}
        zoom={false} // Handled manually
      >
        <ViewTracker />
        <Coordinates.Cartesian
          subdivisions={2}
          xAxis={{ 
            labels: (n) => n.toString(), 
            lines: (viewSettings.showGrid && viewSettings.mode === 'CARTESIAN') ? 1 : 0 
          }}
          yAxis={{ 
            labels: (n) => n.toString(), 
            lines: (viewSettings.showGrid && viewSettings.mode === 'CARTESIAN') ? 1 : 0 
          }}
        />

        {/* Axis Labels at edges */}
        <Text x={viewSettings.xMax - 0.5} y={0.3} attach="n">{xLabel}</Text>
        <Text x={0.3} y={viewSettings.yMax - 0.5} attach="w">{yLabel}</Text>
        
        {viewSettings.showGrid && viewSettings.mode === 'POLAR' && <PolarGrid />}

        <PlotLayer />
      </Mafs>
    </div>
  );
};
