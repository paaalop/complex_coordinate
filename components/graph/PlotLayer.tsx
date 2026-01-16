"use client";

import React, { useState } from 'react';
import { Point, Vector, Text, Theme, Plot } from 'mafs';
import { useStore } from '@/lib/store/useStore';
import { ComplexNumber } from '@/lib/types';

export const PlotLayer = () => {
  const plotResults = useStore(state => state.plotResults);
  const labels = useStore(state => state.viewSettings.labels);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      {Object.values(plotResults).map((result) => {
        if (!result.data) return null;

        if (result.type === 'ERROR') {
            return (
                <Text key={result.expressionId} x={0} y={0} color={Theme.red} size={20}>
                    {result.data as string}
                </Text>
            );
        }

        if (result.type === 'CURVE') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const curveFn = result.data as any;
            
            if (labels === 'XY') {
                return (
                    <Plot.OfX 
                        key={result.expressionId}
                        y={curveFn}
                        color={result.color || Theme.blue}
                    />
                );
            } else {
                // Re/Im mode: Parametric plot
                return (
                    <Plot.Parametric 
                        key={result.expressionId}
                        xy={(t: number) => {
                            const res = curveFn(t) as ComplexNumber;
                            return [res.re, res.im];
                        }}
                        domain={[-100, 100]}
                        color={result.color || Theme.blue}
                    />
                );
            }
        }

        // Assuming data is single ComplexNumber for POINT
        const { re, im } = result.data as ComplexNumber;
        const isHovered = hoveredId === result.expressionId;

        return (
          <g key={result.expressionId} 
             onMouseEnter={() => setHoveredId(result.expressionId)}
             onMouseLeave={() => setHoveredId(null)}
          >
            <>
              <Vector tail={[0, 0]} tip={[re, im]} color={Theme.blue} opacity={0.5} />
              <Point x={re} y={im} color={Theme.blue} />
              {isHovered && (
                  <Text x={re} y={im} attach="n" attachDistance={15} size={20}>
                      {`z = ${re.toFixed(2)} + ${im.toFixed(2)}i`}
                  </Text>
              )}
            </>
          </g>
        );
      })}
    </>
  );
};
