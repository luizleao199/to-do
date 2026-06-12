"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTask } from "../hooks/useTasks";
import { cn } from "@/lib/utils";

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título deve ter no máximo 100 caracteres"),
  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onClose: () => void;
  isOpen: boolean;
}

export const TaskForm = ({ onClose, isOpen }: TaskFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTask = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      await createTask.mutateAsync({
        title: data.title,
        description: data.description || null,
      });
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
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Nova Tarefa</CardTitle>
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
                    "Criar Tarefa"
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