export interface Expression {
  id: string;
  raw: string;        // The user input string (e.g. "z = x + iy")
  targetVariable?: string; // The variable on the left side of =
  compiled: unknown;  // The mathjs compiled object (for fast evaluation)
  isValid: boolean;   // Whether parsing was successful
  error?: string;     // Error message if invalid
  dependencies: string[]; // List of variable names found (e.g. ["x", "y"])
}

export interface Variable {
  name: string;       // e.g. "k", "a"
  value: number;      // Current value (Real number only)
  min: number;        // Default -10
  max: number;        // Default 10
  step: number;       // Default 0.1
  isAnimating: boolean;
  animationSpeed: number; // Steps per frame or similar
}

export interface ViewSettings {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  mode: 'CARTESIAN' | 'POLAR'; // Grid type
  labels: 'XY' | 'ReIm';       // Axis labels
  showGrid: boolean;
}

export interface ComplexNumber {
  re: number;
  im: number;
}

export interface PlotResult {
  expressionId: string;
  type: 'POINT' | 'CURVE' | 'ERROR';
  data: ComplexNumber | ((val: number) => number | ComplexNumber) | string; // Point, Function for curve, or Error string
  color?: string;
  metadata?: {
    isImaginaryMapping?: boolean;
    variableName?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface SavedGraph {
  id: string;
  user_id: string;
  title: string;
  data: GraphState;
  created_at: string;
  updated_at: string;
}

export interface GraphState {
  version: number;
  expressions: Omit<Expression, 'compiled' | 'isValid' | 'error' | 'dependencies'>[];
  variables: Variable[];
  viewSettings: ViewSettings;
}