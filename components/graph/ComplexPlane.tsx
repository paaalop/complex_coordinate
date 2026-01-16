"use client";

import React from 'react';
import { Mafs, Coordinates, Text } from 'mafs';
import { useStore } from '@/lib/store/useStore';
import { PlotLayer } from './PlotLayer';
import { PolarGrid } from './PolarGrid';

export const ComplexPlane = () => {
  const viewSettings = useStore(state => state.viewSettings);
  const setViewSettings = useStore(state => state.setViewSettings);
  
  const xLabel = viewSettings.labels === 'ReIm' ? 'Re' : 'x';
  const yLabel = viewSettings.labels === 'ReIm' ? 'Im' : 'y';

  // State for dragging
  const [isDragging, setIsDragging] = React.useState(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const ZOOM_SENSITIVITY = 0.0005; 
    const delta = e.deltaY;
    // Limit scale factor to avoid extreme jumps
    const scale = Math.max(0.1, Math.min(10, 1 + delta * ZOOM_SENSITIVITY));

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const width = e.currentTarget.clientWidth;
    const height = e.currentTarget.clientHeight;
    
    if (width === 0 || height === 0) return;

    const xRange = viewSettings.xMax - viewSettings.xMin;
    const yRange = viewSettings.yMax - viewSettings.yMin;

    const dx = e.movementX;
    const dy = e.movementY;

    // Drag Right (dx > 0) -> Move View Left (xMin decreases)
    // Drag Down (dy > 0) -> Move View Up (yMin increases) - because Cartesian Y is Up, Pixel Y is Down
    
    const xShift = -dx * (xRange / width);
    const yShift = dy * (yRange / height);

    setViewSettings({
      xMin: viewSettings.xMin + xShift,
      xMax: viewSettings.xMax + xShift,
      yMin: viewSettings.yMin + yShift,
      yMax: viewSettings.yMax + yShift,
    });
  };

  return (
    <div 
      className="w-full h-full min-h-[500px] border border-gray-200 rounded-lg overflow-hidden bg-white cursor-move"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <Mafs
        viewBox={{
            x: [viewSettings.xMin, viewSettings.xMax],
            y: [viewSettings.yMin, viewSettings.yMax],
        }}
        preserveAspectRatio={false}
        pan={false}
        zoom={false}
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
