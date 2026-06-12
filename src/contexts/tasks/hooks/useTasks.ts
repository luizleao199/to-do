import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} from '../services/tasks.service'
import type { Task, CreateTaskInput, UpdateTaskInput } from '../tasks.types'

/** Query key for tasks */
const TASKS_QUERY_KEY = ['tasks']

/**
 * Hook to fetch all tasks for current user
 */
export function useTasks() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: fetchTasks,
  })
}

/**
 * Hook to create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
      toast.success('Tarefa criada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar tarefa')
    },
  })
}

/**
 * Hook to update a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      updateTask(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
      toast.success('Tarefa atualizada!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar tarefa')
    },
  })
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
      toast.success('Tarefa excluída!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir tarefa')
    },
  })
}

/**
 * Hook to toggle task completion
 */
export function useToggleTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      toggleTaskCompletion(id, completed),
    onMutate: async ({ id, completed }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY)

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) =>
        old?.map((task) =>
          task.id === id ? { ...task, completed } : task
        ) ?? []
      )

      return { previousTasks }
    },
    onError: (error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks)
      }
      toast.error(error.message || 'Erro ao atualizar tarefa')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}