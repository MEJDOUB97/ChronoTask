import { Task, Priority } from '../types';

const STORAGE_KEY = 'chrono_tasks_v1';

export const getStoredTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load tasks", e);
    return [];
  }
};

export const saveTasksToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks", e);
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

export const getTasksForDate = (tasks: Task[], dateStr: string): Task[] => {
  return tasks.filter(t => t.date === dateStr).sort((a, b) => {
    // Sort by completion (incomplete first), then priority (high first), then creation
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    
    const priorityWeight = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    
    return a.createdAt - b.createdAt;
  });
};
