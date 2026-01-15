"use client";

import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export const useAnimation = () => {
  const requestRef = useRef<number | null>(null);

  const animate = () => {
    const { variables, updateVariables, setVariableConfig } = useStore.getState();
    const updates: Record<string, number> = {};
    let hasUpdates = false;

    Object.values(variables).forEach(v => {
      if (v.isAnimating) {
        let newValue = v.value + v.animationSpeed;
        
        // Bounce logic
        if (newValue > v.max || newValue < v.min) {
          // Invert speed in store for next frame
          setVariableConfig(v.name, { animationSpeed: -v.animationSpeed });
          newValue = v.value; // Stay at edge for one frame
        }
        
        updates[v.name] = newValue;
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      updateVariables(updates);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []); // Run once on mount
};
