"use client";

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { AlertCircle } from 'lucide-react';

export const ExpressionInput = () => {
  const expressions = useStore(state => state.expressions);
  const plotResults = useStore(state => state.plotResults);
  const labels = useStore(state => state.viewSettings.labels);
  const setExpression = useStore(state => state.setExpression);

  const handleChange = (id: string, value: string) => {
    setExpression(id, value);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Expression</h2>
      <div className="space-y-4">
        {expressions.map((expr) => {
          const result = plotResults[expr.id];
          const hasEvalError = result?.type === 'ERROR';
          const errorMessage = expr.error || (hasEvalError ? (result.data as string) : null);
          const isInvalid = !expr.isValid || hasEvalError;

          return (
            <div key={expr.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={expr.raw}
                  onChange={(e) => handleChange(expr.id, e.target.value)}
                  className={`flex-1 p-2 font-mono text-lg border rounded focus:outline-none focus:ring-2 ${
                    !isInvalid ? 'border-gray-300 focus:ring-blue-500' : 'border-red-500 focus:ring-red-500'
                  }`}
                  placeholder={labels === 'XY' ? "e.g. y = x^2" : "e.g. z = 1 + i"}
                />
              </div>
              {errorMessage && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        {labels === 'XY' ? (
            <>Try: <code>y = x^2</code>, <code>sin(x)</code>, <code>x * cos(x)</code></>
        ) : (
            <>Try: <code>z = 1 + i</code>, <code>e^(i*t)</code>, <code>im_a = 2</code></>
        )}
      </div>
    </div>
  );
};
