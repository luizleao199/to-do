/**
 * useTasks hook - manages tasks state with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  fetchTasks, 
  fetchDeletedTasks,
  createTask, 
  updateTask, 
  deleteTask, 
  restoreTask,
  toggleTaskCompletion,
  fetchCompletedCount,
  fetchDeletedCount
} from '../services/taskService';
import type { Task, TaskInsert, TaskUpdate, TaskFilters } from '../tasks.types';

const TASKS_QUERY_KEY = ['tasks'];
const DELETED_TASKS_QUERY_KEY = ['tasks', 'deleted'];

/**
 * Hook to fetch tasks with optional filters
 */
export const useTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, filters],
    queryFn: () => fetchTasks(filters),
  });
};

/**
 * Hook to fetch deleted tasks
 */
export const useDeletedTasks = () => {
  return useQuery({
    queryKey: DELETED_TASKS_QUERY_KEY,
    queryFn: fetchDeletedTasks,
  });
};

/**
 * Hook to fetch completed tasks count
 */
export const useCompletedCount = () => {
  return useQuery({
    queryKey: ['tasks', 'completed-count'],
    queryFn: fetchCompletedCount,
  });
};

/**
 * Hook to fetch deleted tasks count
 */
export const useDeletedCount = () => {
  return useQuery({
    queryKey: ['tasks', 'deleted-count'],
    queryFn: fetchDeletedCount,
  });
};

/**
 * Hook to create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: TaskInsert) => createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'completed-count'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'deleted-count'] });
      toast.success('Tarefa criada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar tarefa');
    },
  });
};

/**
 * Hook to update a task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TaskUpdate }) => updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'completed-count'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'deleted-count'] });
      toast.success('Tarefa atualizada!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar tarefa');
    },
  });
};

/**
 * Hook to delete a task (soft delete)
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DELETED_TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'completed-count'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'deleted-count'] });
      toast.success('Tarefa movida para a lixeira!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir tarefa');
    },
  });
};

/**
 * Hook to restore a deleted task
 */
export const useRestoreTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DELETED_TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'completed-count'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'deleted-count'] });
      toast.success('Tarefa restaurada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao restaurar tarefa');
    },
  });
};

/**
 * Hook to toggle task completion
 */
export const useToggleTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => toggleTaskCompletion(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'completed-count'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'deleted-count'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao alterar status');
    },
  });
};