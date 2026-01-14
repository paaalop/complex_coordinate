import { all, create } from 'mathjs';

// Create a mathjs instance
const math = create(all);

// Configure mathjs
// 1. Enable implicit multiplication if not already (it is default in many cases but good to ensure)
//    However, mathjs default doesn't always handle '2i' as 2*i without context.
//    We will rely on mathjs's robust parsing but might need preprocessing for strict cases.
//    Actually, mathjs supports '2i' if 'i' is defined.

// 2. Customizations can be added here (e.g., custom functions)

export const parseExpression = (raw: string) => {
  try {
    const node = math.parse(raw);
    const compiled = node.compile();
    
    // Extract dependencies (variables)
    // Filter out constants like i, e, pi and functions
    const constants = ['i', 'e', 'pi', 'z', 'E', 'PI', 'phi', 'tau', 'NaN', 'Infinity'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dependencies = node.filter((n: any) => n.isSymbolNode)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((n: any) => n.name)
      .filter((name: string) => {
          if (constants.includes(name)) return false;
          // Check if it's a function in mathjs
          try {
              const value = math.evaluate(name);
              return typeof value !== 'function';
          } catch {
              return true;
          }
      });

    // Unique dependencies
    const uniqueDeps = Array.from(new Set(dependencies));

    return {
      compiled,
      isValid: true,
      error: undefined,
      dependencies: uniqueDeps as string[],
    };
  } catch (err: unknown) {
    return {
      compiled: null,
      isValid: false,
      error: (err as Error).message || 'Invalid expression',
      dependencies: [],
    };
  }
};

export { math };
