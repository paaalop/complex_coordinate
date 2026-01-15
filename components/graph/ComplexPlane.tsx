"use client";

import React from 'react';
import { Mafs, Coordinates, Text } from 'mafs';
import { useStore } from '@/lib/store/useStore';
import { PlotLayer } from './PlotLayer';
import { PolarGrid } from './PolarGrid';

export const ComplexPlane = () => {
  const viewSettings = useStore(state => state.viewSettings);
  
  const xLabel = viewSettings.labels === 'ReIm' ? 'Re' : 'x';
  const yLabel = viewSettings.labels === 'ReIm' ? 'Im' : 'y';

  return (
    <div className="w-full h-full min-h-[500px] border border-gray-200 rounded-lg overflow-hidden bg-white">
      <Mafs
        viewBox={{
            x: [viewSettings.xMin, viewSettings.xMax],
            y: [viewSettings.yMin, viewSettings.yMax],
            padding: 0.5
        }}
        preserveAspectRatio={false}
        pan={true}
        zoom={true}
        onViewChange={(view) => {
            // Update store bounds for dynamic sampling (T007)
            useStore.getState().setViewSettings({
                xMin: view.x[0],
                xMax: view.x[1],
                yMin: view.y[0],
                yMax: view.y[1]
            });
        }}
      >
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
