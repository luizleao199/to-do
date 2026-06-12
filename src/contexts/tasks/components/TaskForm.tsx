"use client"

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/** Validation schema for task form */
const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().max(1000, 'Descrição muito longa').optional(),
})

export type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  /** Initial data for editing */
  initialData?: TaskFormData
  /** Submit handler */
  onSubmit: (data: TaskFormData) => Promise<void>
  /** Button text */
  submitText?: string
  /** Whether form is loading */
  isLoading?: boolean
  /** Callback when form is closed */
  onClose?: () => void
}

/**
 * TaskForm - Form for creating/editing tasks
 * Uses React Hook Form + Zod for validation
 */
export function TaskForm({
  initialData,
  onSubmit,
  submitText = 'Salvar',
  isLoading = false,
  onClose,
}: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
    },
  })

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit(data)
    reset()
    setIsOpen(false)
    onClose?.()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {initialData ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={() => { setIsOpen(false); onClose?.() }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Título *
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Digite o título da tarefa"
              className={cn(
                'border-gray-200 dark:border-gray-700',
                errors.title && 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500'
              )}
              disabled={isLoading}
              autoFocus
            />
            {errors.title && (
              <p className="text-sm text-red-500 dark:text-red-400" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descrição opcional..."
              rows={3}
              className="border-gray-200 dark:border-gray-700"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-red-500 dark:text-red-400" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setIsOpen(false); onClose?.() }}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </span>
              ) : (
                submitText
              )}
            </Button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  )
}