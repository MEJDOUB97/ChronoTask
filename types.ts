export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface DayStats {
  date: string;
  total: number;
  completed: number;
}

export interface InsightState {
  loading: boolean;
  content: string | null;
  error: string | null;
}