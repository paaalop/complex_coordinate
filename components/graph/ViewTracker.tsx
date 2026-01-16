"use client";

import { useEffect, useRef } from 'react';
import { usePaneContext } from 'mafs';
import { useStore } from '@/lib/store/useStore';

export const ViewTracker = () => {
    const { xPaneRange, yPaneRange } = usePaneContext();
    const setViewSettings = useStore(state => state.setViewSettings);
    // Use ref to track last update to prevent loops if needed, though debounce helps
    const lastUpdate = useRef<{x: [number, number], y: [number, number]} | null>(null);

    useEffect(() => {
        // xPaneRange is [min, max]
        // yPaneRange is [min, max]
        
        if (!xPaneRange || !yPaneRange) return;

        const [xMin, xMax] = xPaneRange;
        const [yMin, yMax] = yPaneRange;
        
        // Check if changed significantly to avoid loops/thrashing
        // This is important because updating store might re-render parent passing viewBox
        if (lastUpdate.current) {
            const { x, y } = lastUpdate.current;
            if (
                Math.abs(x[0] - xMin) < 0.001 &&
                Math.abs(x[1] - xMax) < 0.001 &&
                Math.abs(y[0] - yMin) < 0.001 &&
                Math.abs(y[1] - yMax) < 0.001
            ) {
                return;
            }
        }

        // Debounce to avoid excessive store updates during smooth panning/zooming
        const handler = setTimeout(() => {
            lastUpdate.current = { x: [xMin, xMax], y: [yMin, yMax] };
            setViewSettings({
                xMin,
                xMax,
                yMin,
                yMax
            });
        }, 100); 

        return () => clearTimeout(handler);
    }, [xPaneRange, yPaneRange, setViewSettings]);

    return null;
};
