"use client";

import { useState } from "react";
import { X, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTask, useUpdateTask } from "../hooks/useTasks";
import { cn, formatDate } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import type { Task } from "../tasks.types";

const today = new Date();
today.setHours(0, 0, 0, 0);

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título deve ter no máximo 100 caracteres"),
  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
  due_date: z.string().nullable().refine(
    (date) => {
      if (!date) return true;
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    { message: "A data de vencimento não pode ser anterior a hoje" }
  ),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onClose: () => void;
  isOpen: boolean;
  taskToEdit?: Task | null;
}

export const TaskForm = ({ onClose, isOpen, taskToEdit }: TaskFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isEditing = !!taskToEdit;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      due_date: null,
    },
  });

  const watchedDueDate = watch("due_date");

  // Pre-populate form when editing
  const handleOpenChange = (open: boolean) => {
    if (open && taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || "",
        due_date: taskToEdit.due_date,
      });
    } else if (!open) {
      reset({
        title: "",
        description: "",
        due_date: null,
      });
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        description: data.description || null,
        due_date: data.due_date,
      };

      if (isEditing && taskToEdit) {
        await updateTask.mutateAsync({ id: taskToEdit.id, updates: payload });
      } else {
        await createTask.mutateAsync(payload);
      }
      reset();
      onClose();
    } catch (err) {
      // Error handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-purple-950 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-800 animate-slide-up">
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="pb-4 flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
            </CardTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Título *
                </Label>
                <Input
                  id="title"
                  placeholder="O que precisa ser feito?"
                  {...register("title")}
                  className={cn(
                    "border-gray-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500",
                    errors.title && "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
                  )}
                  disabled={isSubmitting}
                  autoFocus
                />
                {errors.title && (
                  <p className="text-sm text-red-500 dark:text-red-400" role="alert">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descrição (opcional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Adicione detalhes..."
                  {...register("description")}
                  rows={3}
                  className="border-gray-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500"
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 dark:text-red-400" role="alert">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="due_date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data de vencimento (opcional)
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        errors.due_date && "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
                      )}
                      disabled={isSubmitting}
                    >
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" aria-hidden="true" />
                      {watchedDueDate ? formatDate(watchedDueDate) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={watchedDueDate ? new Date(watchedDueDate) : undefined}
                      onSelect={setValue("due_date")}
                      initialFocus
                      disabledBefore={today}
                      className="rounded-xl border-purple-100 dark:border-purple-800"
                    />
                  </PopoverContent>
                </Popover>
                {errors.due_date && (
                  <p className="text-sm text-red-500 dark:text-red-400" role="alert">
                    {errors.due_date.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </span>
                  ) : (
                    isEditing ? "Salvar" : "Criar Tarefa"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};