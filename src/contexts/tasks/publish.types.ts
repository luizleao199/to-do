/**
 * Published task types for sharing tasks publicly
 */

export interface PublishTask {
  id: string;
  original_task_id: string | null;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  published_at: string;
  original_created_at: string | null;
}

export interface PublishTaskInsert {
  original_task_id?: string | null;
  title: string;
  description?: string | null;
  due_date?: string | null;
  completed?: boolean;
}

export interface PublishTaskUpdate {
  title?: string;
  description?: string | null;
  due_date?: string | null;
  completed?: boolean;
}