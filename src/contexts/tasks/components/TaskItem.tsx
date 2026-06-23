"use client";

import { useState } from "react";
import { Check, MoreHorizontal, Trash2, AlertCircle, Calendar, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToggleTask, useDeleteTask } from "../hooks/useTasks";
import { cn, formatDate, getDueDateStatus, getDueDateLabel } from "@/lib/utils";
import type { Task } from "../tasks.types";
import { TaskForm } from "./TaskForm";

interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);

  // Derive completed from status field
  const isCompleted = task.status === 'concluida';

  const handleToggle = () => {
    toggleTask.mutate({ id: task.id, completed: !isCompleted });
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      deleteTask.mutate(task.id);
    }
  };

  const handleEditClick = () => {
    setShowEditConfirm(true);
  };

  const handleConfirmEdit = () => {
    setShowEditConfirm(false);
    setIsEditOpen(true);
  };

  const handleCloseForm = () => {
    setIsEditOpen(false);
  };

  // Use correct database field names: data_vencimento, not due_date
  const dueDateStatus = getDueDateStatus(task.data_vencimento, isCompleted);
  const dueDateLabel = getDueDateLabel(task.data_vencimento);

  const getCardClasses = () => {
    const base = "bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm transition-all duration-200 group hover:shadow-md hover:shadow-purple-500/10";
    if (isCompleted) return cn(base, "opacity-70");
    if (dueDateStatus === 'overdue') return cn(base, "border-2 border-red-300 dark:border-red-700");
    if (dueDateStatus === 'today') return cn(base, "border-2 border-yellow-300 dark:border-yellow-700");
    return cn(base, "border-purple-100 dark:border-purple-800");
  };

  return (
    <>
      <Card className={getCardClasses()}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button
                onClick={handleToggle}
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                  isCompleted
                    ? "border-green-500 bg-green-500 text-white hover:bg-green-600"
                    : dueDateStatus === 'overdue'
                    ? "border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                    : dueDateStatus === 'today'
                    ? "border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                    : "border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                )}
                aria-label={isCompleted ? "Marcar como pendente" : "Marcar como concluída"}
              >
                {isCompleted && <Check className="w-3.5 h-3.5" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={cn(
                    "font-medium truncate",
                    isCompleted ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"
                  )}>
                    {task.titulo}
                  </h3>
                  {task.data_vencimento && !isCompleted && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "flex items-center gap-1 px-2 py-0.5 text-xs",
                        dueDateStatus === 'overdue' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                        dueDateStatus === 'today' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                        dueDateStatus === 'normal' && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      )}
                    >
                      {dueDateStatus === 'overdue' && <AlertCircle className="w-3 h-3" />}
                      {dueDateStatus === 'today' && <Calendar className="w-3 h-3" />}
                      {dueDateStatus === 'normal' && <Calendar className="w-3 h-3" />}
                      {dueDateLabel}
                    </Badge>
                  )}
                  {!task.data_vencimento && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      Sem data
                    </Badge>
                  )}
                </div>
                {task.descricao && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                    {task.descricao}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Mais opções"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-purple-950 border-purple-800">
                <DropdownMenuItem 
                  onClick={handleEditClick}
                  className="flex items-center gap-2 text-purple-600 dark:text-purple-400 focus:text-purple-600 dark:focus:text-purple-400"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Edit Confirmation Dialog */}
      <AlertDialog open={showEditConfirm} onOpenChange={setShowEditConfirm}>
        <AlertDialogContent className="dark:bg-purple-950 border-purple-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Editar tarefa
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
              Deseja editar a tarefa <strong>{task.titulo}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmEdit} className="bg-purple-600 hover:bg-purple-700">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Form Modal */}
      <TaskForm 
        isOpen={isEditOpen} 
        onClose={handleCloseForm} 
        taskToEdit={task} 
      />
    </>
  );
};