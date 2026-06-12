/**
 * useTasks hook - manages tasks state with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchTasks, createTask, updateTask, deleteTask, toggleTaskCompletion } from '../services/taskService';
import type { Task, TaskInsert, TaskUpdate, TaskFilters } from '../tasks.types';

const TASKS_QUERY_KEY = ['tasks'];

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
 * Hook to create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: TaskInsert) => createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
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
      toast.success('Tarefa atualizada!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar tarefa');
    },
  });
};

/**
 * Hook to delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      toast.success('Tarefa excluída!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir tarefa');
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
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao alterar status');
    },
  });
};