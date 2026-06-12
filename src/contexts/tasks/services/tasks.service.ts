import { supabase } from '@/integrations/supabase/client'
import type { Task, CreateTaskInput, UpdateTaskInput } from '../tasks.types'

/**
 * Tasks Service
 * Encapsulates all Supabase operations for tasks
 */

/** Fetch all tasks for current user */
export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

/** Create a new task for current user */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...input, user_id: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/** Update an existing task */
export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/** Delete a task */
export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

/** Toggle task completion status */
export async function toggleTaskCompletion(id: string, completed: boolean): Promise<Task> {
  return updateTask(id, { completed })
}