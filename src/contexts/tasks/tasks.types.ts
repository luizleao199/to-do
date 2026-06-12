/** Task entity from database */
export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  completed: boolean
  created_at: string
}

/** Input for creating a new task */
export interface CreateTaskInput {
  title: string
  description?: string
}

/** Input for updating a task */
export interface UpdateTaskInput {
  title?: string
  description?: string
  completed?: boolean
}

/** Task with formatted dates for UI */
export interface TaskDisplay extends Task {
  createdAtFormatted: string
}