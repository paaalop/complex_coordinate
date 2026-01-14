"use client";

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { Variable } from '@/lib/types';
import { Play, Pause, Settings2 } from 'lucide-react';

interface Props {
  variable: Variable;
}

export const VariableSlider = ({ variable }: Props) => {
  const updateVariable = useStore(state => state.updateVariable);
  const setVariableConfig = useStore(state => state.setVariableConfig);
  const toggleAnimation = useStore(state => state.toggleAnimation);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateVariable(variable.name, parseFloat(e.target.value));
  };

  return (
    <div className="p-3 bg-gray-50 rounded-md border border-gray-100 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-blue-600">{variable.name}</span>
          <span className="text-sm font-mono text-gray-600">= {variable.value.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => toggleAnimation(variable.name)}
            className={`p-1 rounded hover:bg-gray-200 transition-colors ${variable.isAnimating ? 'text-blue-500' : 'text-gray-400'}`}
          >
            {variable.isAnimating ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button className="p-1 rounded hover:bg-gray-200 text-gray-400">
            <Settings2 size={16} />
          </button>
        </div>
      </div>

      <input
        type="range"
        min={variable.min}
        max={variable.max}
        step={variable.step}
        value={variable.value}
        onChange={handleSliderChange}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />

      <div className="flex justify-between text-[10px] text-gray-400 font-mono">
        <span>{variable.min}</span>
        <span>{variable.max}</span>
      </div>
    </div>
  );
};
