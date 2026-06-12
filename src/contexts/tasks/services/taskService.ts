/**
 * Task service - handles all Supabase operations for tasks
 */

import { supabase } from '@/integrations/supabase/client';
import type { Task, TaskInsert, TaskUpdate, TaskFilters } from '../tasks.types';

/**
 * Fetches all tasks for the current user
 */
export const fetchTasks = async (filters?: TaskFilters): Promise<Task[]> => {
  let query = supabase
    .from('tasks')
    .select('*');

  if (filters?.completed !== undefined) {
    query = query.eq('completed', filters.completed);
  }

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'created_at';
  if (sortBy === 'due_date') {
    query = query.order('due_date', { ascending: true, nullsLast: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

/**
 * Creates a new task for the current user
 */
export const createTask = async (task: TaskInsert): Promise<Task> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...task,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Updates an existing task
 */
export const updateTask = async (id: string, updates: TaskUpdate): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Deletes a task
 */
export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Toggles task completion status
 */
export const toggleTaskCompletion = async (id: string, completed: boolean): Promise<Task> => {
  return updateTask(id, { completed });
};