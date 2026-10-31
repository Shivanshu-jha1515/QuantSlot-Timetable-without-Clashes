export interface ClassItem {
  id: string | number;
  name: string;
  teacher?: string;
  group?: string;
  room?: string;
  preferred_slot?: number;
}

export interface OptimizationWeights {
  A: number;
  B: number;
  C: number;
}

export interface AssignedClassDetail {
  id: string | number;
  name: string;
  teacher: string;
  group: string;
  room: string;
  slot: number;
  day: string;
  period: string;
}

export interface OptimizationResponse {
  assignment: Record<string, number>;
  clashes_before: number;
  clashes_after: number;
  solve_time_ms: number;
  solver_used: string;
  details: AssignedClassDetail[];
}

export interface ConflictPair {
  class1: ClassItem;
  class2: ClassItem;
  reason: string;
  slot: number;
}
