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
    .from('tarefas')
    .select('*');

  if (filters?.concluida !== undefined) {
    query = query.eq('concluida', filters.concluida);
  }

  if (filters?.search) {
    query = query.ilike('titulo', `%${filters.search}%`);
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'criado_em';
  if (sortBy === 'data_vencimento') {
    query = query.order('data_vencimento', { ascending: true, nullsLast: true });
  } else {
    query = query.order('criado_em', { ascending: false });
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
    .from('tarefas')
    .insert({
      titulo: task.titulo,
      descricao: task.descricao,
      data_vencimento: task.data_vencimento,
      concluida: task.concluida ?? false,
      usuario_id: user.id,
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
  const updateData: Record<string, unknown> = {};
  
  if (updates.titulo !== undefined) updateData.titulo = updates.titulo;
  if (updates.descricao !== undefined) updateData.descricao = updates.descricao;
  if (updates.data_vencimento !== undefined) updateData.data_vencimento = updates.data_vencimento;
  if (updates.concluida !== undefined) updateData.concluida = updates.concluida;

  const { data, error } = await supabase
    .from('tarefas')
    .update(updateData)
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
    .from('tarefas')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Toggles task completion status
 */
export const toggleTaskCompletion = async (id: string, concluida: boolean): Promise<Task> => {
  return updateTask(id, { concluida });
};