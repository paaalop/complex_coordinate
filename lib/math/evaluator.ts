import { ComplexNumber, PlotResult, ViewSettings } from '../types';
import { math } from './parser';

export const evaluateExpression = (
  expressionId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compiled: any,
  scope: Record<string, number>,
  viewSettings: ViewSettings,
  dependencies: string[] = [],
  targetVariable?: string
): PlotResult => {
  if (!compiled) {
    return {
      expressionId,
      type: 'ERROR',
      data: 'Not compiled',
    };
  }

  const { labels } = viewSettings;

  try {
    // 1. Reserved Word Defense & Mode Validation (T014, T019)
    if (labels === 'ReIm' && dependencies.includes('y')) {
        return {
            expressionId,
            type: 'ERROR',
            data: 'Variable "y" is not allowed in Re/Im mode. Use "im_" prefix for imaginary components.',
        };
    }

    // 2. Detection of CURVE vs POINT
    
    // XY Mode: Continuous Curve if 'x' is present
    if (labels === 'XY' && dependencies.includes('x')) {
        return {
            expressionId,
            type: 'CURVE',
            data: (x: number) => {
                try {
                    const res = compiled.evaluate({ ...scope, x, i: math.i });
                    // For XY mode, we expect a real number or we take the real part
                    if (typeof res === 'number') return res;
                    if (res && typeof res === 'object' && 're' in res) return res.re;
                    return 0;
                } catch {
                    return NaN;
                }
            }
        };
    }

    // ReIm Mode: Parametric Curve if 't' or 'x' is present
    if (labels === 'ReIm' && (dependencies.includes('t') || dependencies.includes('x'))) {
        const param = dependencies.includes('t') ? 't' : 'x';
        return {
            expressionId,
            type: 'CURVE',
            data: (val: number): ComplexNumber => {
                try {
                    const res = compiled.evaluate({ ...scope, [param]: val, i: math.i });
                    if (typeof res === 'number') return { re: res, im: 0 };
                    if (res && typeof res === 'object' && 're' in res && 'im' in res) {
                        return { re: res.re, im: res.im };
                    }
                    return { re: 0, im: 0 };
                } catch {
                    return { re: NaN, im: NaN };
                }
            }
        };
    }

    // ReIm Mode: Special Imaginary Mapping (im_ prefix)
    const imVar = targetVariable?.startsWith('im_') ? targetVariable : dependencies.find(d => d.startsWith('im_'));
    if (labels === 'ReIm' && imVar) {
        // Return a curve that is a horizontal line at the evaluated value
        // Note: This logic might be better handled by returning a specific type
        // but for now let's follow the requirement: horizontal line z = t + i * expr
        return {
            expressionId,
            type: 'CURVE',
            data: (t: number): ComplexNumber => {
                try {
                    const res = compiled.evaluate({ ...scope, i: math.i });
                    const val = typeof res === 'number' ? res : (res?.re || 0);
                    return { re: t, im: val };
                } catch {
                    return { re: t, im: NaN };
                }
            },
            metadata: {
                isImaginaryMapping: true,
                variableName: imVar
            }
        };
    }

    // 3. Standard Point Evaluation
    const evalScope = { ...scope, i: math.i };
    const result = compiled.evaluate(evalScope);

    if (result && typeof result === 'object' && 're' in result && 'im' in result) {
      if (!isFinite(result.re) || !isFinite(result.im)) {
         return {
          expressionId,
          type: 'ERROR',
          data: 'UNDEFINED',
        };
      }
      return {
        expressionId,
        type: 'POINT',
        data: { re: result.re, im: result.im },
      };
    } else if (typeof result === 'number') {
        if (!isFinite(result)) {
             return {
              expressionId,
              type: 'ERROR',
              data: 'UNDEFINED',
            };
        }
        return {
            expressionId,
            type: 'POINT',
            data: { re: result, im: 0 },
        };
    } else {
       return {
         expressionId,
         type: 'ERROR',
         data: 'Unsupported result type',
       };
    }

  } catch (err: unknown) {
    return {
      expressionId,
      type: 'ERROR',
      data: (err as Error).message || 'Evaluation Error',
    };
  }
};