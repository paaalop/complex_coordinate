// Supabase Client Interactions
// This file defines the expected shape of data and service methods for the frontend.

export interface SavedGraph {
  id: string;
  user_id: string;
  title: string;
  data: GraphState;
  created_at: string;
  updated_at: string;
}

export interface GraphState {
  viewport: {
    x: { min: number; max: number };
    y: { min: number; max: number };
  };
  expressions: Expression[];
  variables: Variable[];
}

// Re-using existing types if available, otherwise defined here for contract
interface Expression {
  id: string;
  latex: string;
  color: string;
  hidden: boolean;
  // ... other props
}

interface Variable {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export interface GraphService {
  /**
   * Loads all graphs for the current authenticated user.
   */
  listGraphs(): Promise<SavedGraph[]>;

  /**
   * Loads a specific graph by ID.
   * Throws error if not found or access denied.
   */
  getGraph(id: string): Promise<SavedGraph>;

  /**
   * Creates a new saved graph.
   */
  createGraph(title: string, data: GraphState): Promise<SavedGraph>;

  /**
   * Updates an existing graph.
   */
  updateGraph(id: string, title: string, data: GraphState): Promise<SavedGraph>;

  /**
   * Deletes a graph.
   */
  deleteGraph(id: string): Promise<void>;
}
