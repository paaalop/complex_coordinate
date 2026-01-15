"use client";

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { VariableSlider } from './VariableSlider';

export const VariableList = () => {
  const variables = useStore(useShallow(state => Object.values(state.variables).filter(v => v && v.name)));

  if (variables.length === 0) {
    return (
      <div className="text-sm text-gray-400 italic py-4">
        No variables detected. Try adding one (e.g., z = k + i)
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Variables</h3>
      <div className="space-y-3">
        {variables.map((variable) => (
          <VariableSlider key={variable.name} variable={variable} />
        ))}
      </div>
    </div>
  );
};
