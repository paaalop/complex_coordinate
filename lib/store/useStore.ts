import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Expression, Variable, ViewSettings, PlotResult } from '../types';
import { parseExpression } from '../math/parser';
import { evaluateExpression } from '../math/evaluator';

interface AppState {
  // Input
  expressions: Expression[];
  variables: Record<string, Variable>;
  
  // Settings
  viewSettings: ViewSettings;
  
  // Results (computed derived state could be here or computed on fly)
  // For performance, we might compute on demand or in component, but store needs to trigger updates.
  // Let's store results to share between Input status and Graph.
  plotResults: Record<string, PlotResult>;

  // Actions
  setExpression: (id: string, raw: string) => void;
  updateVariable: (name: string, value: number) => void;
  updateVariables: (updates: Record<string, number>) => void;
  setVariableConfig: (name: string, config: Partial<Variable>) => void;
  toggleAnimation: (name: string) => void;
  loadState: (savedState: import('../types').GraphState) => void;
  
  // View Actions (Phase 5)
  toggleLabels: () => void;
  toggleGridMode: () => void;
  toggleGrid: () => void;
  setViewSettings: (settings: Partial<ViewSettings>) => void;
}

const DEFAULT_VIEW: ViewSettings = {
  xMin: -5,
  xMax: 5,
  yMin: -5,
  yMax: 5,
  mode: 'CARTESIAN',
  labels: 'XY', // Default to XY for MVP
  showGrid: true,
};

// Helper to re-evaluate all expressions when variables or mode changes
const reEvaluateAll = (expressions: Expression[], variables: Record<string, Variable>, viewSettings: ViewSettings): Record<string, PlotResult> => {
    const results: Record<string, PlotResult> = {};
    const scope = Object.fromEntries(Object.values(variables).map(v => [v.name, v.value]));
    
    expressions.forEach(expr => {
        if (expr.isValid && expr.compiled) {
            results[expr.id] = evaluateExpression(expr.id, expr.compiled, scope, viewSettings, expr.dependencies, expr.targetVariable);
        }
    });
    return results;
};

// Simple throttling state
let lastUpdateTime = 0;
const THROTTLE_MS = 16; // ~60fps

export const useStore = create<AppState>()(
  devtools((set, get) => ({
    expressions: [{ 
        id: 'expr-1', 
        raw: 'x^2', 
        compiled: null,
        isValid: true, 
        dependencies: ['x'] 
    }], 
    variables: {},
    viewSettings: DEFAULT_VIEW,
    plotResults: {},

    setExpression: (id, raw) => {
      // Improved assignment handling
      const eqIndex = raw.indexOf('=');
      let expressionToParse = raw;
      let targetVariable = '';
      
      if (eqIndex !== -1) {
          const leftPart = raw.substring(0, eqIndex).trim();
          const rightPart = raw.substring(eqIndex + 1).trim();
          
          // Check if left part is a simple variable (y, z, f(x), etc.)
          if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(leftPart)) {
              targetVariable = leftPart;
              expressionToParse = rightPart;
          } else if (leftPart.includes('(')) {
              // Handle f(x) = ...
              targetVariable = leftPart.split('(')[0].trim();
              expressionToParse = rightPart;
          } else {
              // This might be an implicit equation like x^2 + y^2 = 1
              // We don't support this for plotting yet.
              set(state => {
                  const newExpressions = state.expressions.map(e => 
                      e.id === id ? { ...e, raw, isValid: false, error: 'Implicit equations are not supported. Use y = f(x) or z = f(t) form.' } : e
                  );
                  return { expressions: newExpressions };
              });
              return;
          }
      }

      const { compiled, isValid, error, dependencies } = parseExpression(expressionToParse); 
      
      set(state => {
        const newExpressions = state.expressions.map(e => 
          e.id === id ? { ...e, raw, targetVariable, compiled, isValid: isValid && !error, error, dependencies } : e
        );
        
        const newVariables = { ...state.variables };
        dependencies.forEach(dep => {
            // Only create variables for non-special symbols (not x, y, t, i)
            const reserved = ['x', 'y', 't', 'i'];
            if (!reserved.includes(dep) && !newVariables[dep]) {
                newVariables[dep] = {
                    name: dep,
                    value: 1,
                    min: -5,
                    max: 5,
                    step: 0.1,
                    isAnimating: false,
                    animationSpeed: 0.05
                };
            }
        });

        const newResults = reEvaluateAll(newExpressions, newVariables, state.viewSettings);

        return { 
            expressions: newExpressions,
            variables: newVariables,
            plotResults: newResults
        };
      });
    },

    updateVariable: (name, value) => {
      const now = performance.now();
      const shouldThrottle = (now - lastUpdateTime) < THROTTLE_MS;
      
      set(state => {
          if (!state.variables[name]) return state;
          
          const newVariables = {
              ...state.variables,
              [name]: { ...state.variables[name], value }
          };
          
          if (shouldThrottle && !state.variables[name].isAnimating) {
              return { variables: newVariables };
          }
          
          lastUpdateTime = now;
          const newResults = reEvaluateAll(state.expressions, newVariables, state.viewSettings);
          return { variables: newVariables, plotResults: newResults };
      });
    },

    updateVariables: (updates) => {
      set(state => {
        const newVariables = { ...state.variables };
        let hasChanges = false;
        Object.entries(updates).forEach(([name, value]) => {
          if (newVariables[name]) {
            newVariables[name] = { ...newVariables[name], value };
            hasChanges = true;
          }
        });
        
        if (!hasChanges) return state;

        const newResults = reEvaluateAll(state.expressions, newVariables, state.viewSettings);
        return { variables: newVariables, plotResults: newResults };
      });
    },

    setVariableConfig: (name, config) => {
        set(state => {
            if (!state.variables[name]) return state;
            return {
                variables: {
                    ...state.variables,
                    [name]: { ...state.variables[name], ...config }
                }
            };
        });
    },

    toggleAnimation: (name) => {
         set(state => {
            if (!state.variables[name]) return state;
            return {
                variables: {
                    ...state.variables,
                    [name]: { ...state.variables[name], isAnimating: !state.variables[name].isAnimating }
                }
            };
        });
    },

    toggleLabels: () => {
        set(state => {
            const newLabels: ViewSettings['labels'] = state.viewSettings.labels === 'ReIm' ? 'XY' : 'ReIm';
            const newViewSettings = { ...state.viewSettings, labels: newLabels };
            const newResults = reEvaluateAll(state.expressions, state.variables, newViewSettings);
            return {
                viewSettings: newViewSettings,
                plotResults: newResults
            };
        });
    },

    toggleGridMode: () => {
        set(state => ({
            viewSettings: {
                ...state.viewSettings,
                mode: state.viewSettings.mode === 'CARTESIAN' ? 'POLAR' : 'CARTESIAN'
            }
        }));
    },

    toggleGrid: () => {
         set(state => ({
            viewSettings: {
                ...state.viewSettings,
                showGrid: !state.viewSettings.showGrid
            }
        }));
    },

    setViewSettings: (settings) => {
        set(state => {
            const newViewSettings = { ...state.viewSettings, ...settings };
            // If bounds changed, we might need to re-evaluate if we are doing dynamic sampling
            const newResults = reEvaluateAll(state.expressions, state.variables, newViewSettings);
            return {
                viewSettings: newViewSettings,
                plotResults: newResults
            };
        });
    },

    loadState: (savedState) => {
        set(state => {
             // Parse expressions
            const newExpressions = savedState.expressions.map(e => {
                 // Logic duplicated from setExpression for parsing
                const raw = e.raw;
                const eqIndex = raw.indexOf('=');
                let expressionToParse = raw;
                let targetVariable = '';
                
                if (eqIndex !== -1) {
                    const leftPart = raw.substring(0, eqIndex).trim();
                    const rightPart = raw.substring(eqIndex + 1).trim();
                    if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(leftPart)) {
                        targetVariable = leftPart;
                        expressionToParse = rightPart;
                    } else if (leftPart.includes('(')) {
                        targetVariable = leftPart.split('(')[0].trim();
                        expressionToParse = rightPart;
                    }
                }

                const { compiled, isValid, error, dependencies } = parseExpression(expressionToParse);
                return {
                    ...e,
                    raw,
                    targetVariable, // Use parsed or saved? Saved might be better if we trust it, but re-parsing ensures consistency.
                    compiled,
                    isValid: isValid && !error,
                    error,
                    dependencies
                };
            });

            const newVariables: Record<string, import('../types').Variable> = {};
            savedState.variables.forEach(v => {
                newVariables[v.name] = v;
            });

            const newResults = reEvaluateAll(newExpressions, newVariables, savedState.viewSettings);

            return {
                expressions: newExpressions,
                variables: newVariables,
                viewSettings: savedState.viewSettings,
                plotResults: newResults
            };
        });
    }
  }))
);

export const serializeGraphState = (): import('../types').GraphState => {
  const state = useStore.getState();
  return {
    version: 1,
    expressions: state.expressions.map(({ id, raw, targetVariable }) => ({ 
      id, 
      raw, 
      targetVariable 
    })),
    variables: Object.values(state.variables),
    viewSettings: state.viewSettings
  };
};
