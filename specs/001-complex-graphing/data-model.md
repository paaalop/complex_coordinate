# Data Model: Complex Coordinate Graphing

## Entities

### 1. Expression
Represents the mathematical formula entered by the user.

```typescript
interface Expression {
  id: string;
  raw: string;        // The user input string (e.g. "z = x + iy")
  compiled: any;      // The mathjs compiled object (for fast evaluation)
  isValid: boolean;   // Whether parsing was successful
  error?: string;     // Error message if invalid
  dependencies: string[]; // List of variable names found (e.g. ["x", "y"])
}
```

### 2. Variable (Slider)
Represents a user-adjustable parameter.

```typescript
interface Variable {
  name: string;       // e.g. "k", "a"
  value: number;      // Current value (Real number only)
  min: number;        // Default -10
  max: number;        // Default 10
  step: number;       // Default 0.1
  isAnimating: boolean;
  animationSpeed: number; // Steps per frame or similar
}
```

### 3. ViewSettings
Configuration for the graph viewport.

```typescript
interface ViewSettings {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  mode: 'CARTESIAN' | 'POLAR'; // Grid type
  labels: 'XY' | 'ReIm';       // Axis labels
  showGrid: boolean;
}
```

### 4. PlotResult
The calculated output to be rendered.

```typescript
interface ComplexNumber {
  re: number;
  im: number;
}

interface PlotResult {
  expressionId: string;
  type: 'POINT' | 'VECTOR' | 'CURVE';
  data: ComplexNumber | ComplexNumber[]; // Single point or array of points
  error?: 'UNDEFINED' | string; // For 1/0 or similar
}
```

## State Management (Zustand Store)

```typescript
interface AppState {
  // Input
  expressions: Expression[];
  variables: Record<string, Variable>;
  
  // Settings
  viewSettings: ViewSettings;
  
  // Actions
  setExpression: (id: string, raw: string) => void;
  updateVariable: (name: string, value: number) => void;
  setVariableConfig: (name: string, config: Partial<Variable>) => void;
  toggleAnimation: (name: string) => void;
  
  // Persistence
  serializeToURL: () => string;
  hydrateFromURL: (params: URLSearchParams) => void;
}
```
