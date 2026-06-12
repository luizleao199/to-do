/**
 * Task types for the To-Do List application
 */

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
}

export interface TaskInsert {
  title: string;
  description?: string | null;
  due_date?: string | null;
  completed?: boolean;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  due_date?: string | null;
  completed?: boolean;
}

export interface TaskFilters {
  completed?: boolean;
  search?: string;
  sortBy?: 'created_at' | 'due_date';
}