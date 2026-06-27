"use client";

import { CheckSquare, Trash2, Loader2, RotateCcw, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDeletedTasks } from "../hooks/useTasks";
import { useRestoreTask, useDeleteTask } from "../hooks/useTasks";
import { cn, formatDate, getDueDateStatus, getDueDateLabel } from "@/lib/utils";
import type { Task } from "../tasks.types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface TrashListProps {
  onClose?: () => void;
}

export const TrashList = ({ onClose }: TrashListProps) => {
  const { data: deletedTasks, isLoading, error, refetch } = useDeletedTasks();
  const restoreTask = useRestoreTask();
  const deleteTask = useDeleteTask();
  const [showRestoreConfirm, setShowRestoreConfirm] = useState<{ taskId: string | null; taskTitle: string }>({ taskId: null, taskTitle: '' });
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState<{ taskId: string | null; taskTitle: string }>({ taskId: null, taskTitle: '' });

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border-purple-100 dark:border-purple-800">
        <CardContent className="py-12 text-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Carregando lixeira...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border-purple-100 dark:border-purple-800 border-red-200 dark:border-red-800">
        <CardContent className="py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 mb-2">Erro ao carregar lixeira</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{error.message}</p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <Loader2 className="w-4 h-4" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleRestoreClick = (taskId: string, taskTitle: string) => {
    setShowRestoreConfirm({ taskId, taskTitle });
  };

  const handleConfirmRestore = () => {
    if (showRestoreConfirm.taskId) {
      restoreTask.mutate(showRestoreConfirm.taskId);
      setShowRestoreConfirm({ taskId: null, taskTitle: '' });
    }
  };

  const handlePermanentDeleteClick = (taskId: string, taskTitle: string) => {
    setShowPermanentDeleteConfirm({ taskId, taskTitle });
  };

  const handleConfirmPermanentDelete = () => {
    if (showPermanentDeleteConfirm.taskId) {
      deleteTask.mutate(showPermanentDeleteConfirm.taskId);
      setShowPermanentDeleteConfirm({ taskId: null, taskTitle: '' });
    }
  };

  const dueDateStatus = (task: Task) => getDueDateStatus(task.data_vencimento, false);
  const dueDateLabel = (task: Task) => getDueDateLabel(task.data_vencimento);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lixeira</h2>
          {deletedTasks && deletedTasks.length > 0 && (
            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {deletedTasks.length}
            </Badge>
          )}
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>

      {/* Empty State */}
      {(!deletedTasks || deletedTasks.length === 0) && (
        <Card className="bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border-purple-100 dark:border-purple-800">
          <CardContent className="py-12 px-6 text-center">
            <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Lixeira vazia
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              Tarefas excluídas aparecerão aqui. Você pode restaurá-las ou excluí-las permanentemente.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Deleted Tasks List */}
      {deletedTasks && deletedTasks.length > 0 && (
        <div className="space-y-3">
          {deletedTasks.map((task) => {
            const status = dueDateStatus(task);
            const label = dueDateLabel(task);
            
            return (
              <Card 
                key={task.id} 
                className={cn(
                  "bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm transition-all duration-20000 group hover:shadow-md",
                  status === 'overdue' && "border-2 border-red-300 dark:border-red-700",
                  status === 'today' && "border-2 border-yellow-300 dark:border-yellow-700",
                  status === 'normal' && "border-purple-100 dark:border-purple-800"
                )}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {task.titulo}
                          </h3>
                          {task.data_vencimento && (
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "flex items-center gap-1 px-2 py-0.5 text-xs",
                                status === 'overdue' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                                status === 'today' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                                status === 'normal' && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                              )}
                            >
                              {status === 'overdue' && <AlertCircle className="w-3 h-3" />}
                              {status === 'today' && <Calendar className="w-3 h-3" />}
                              {status === 'normal' && <Calendar className="w-3 h-3" />}
                              {label}
                            </Badge>
                          )}
                          {!task.data_vencimento && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              Sem data
                            </Badge>
                          )}
                          <Badge variant="outline" className="border-red-300 text-red-600 dark:border-red-700 dark:text-red-400">
                            Excluída
                          </Badge>
                        </div>
                        {task.descricao && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                            {task.descricao}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Excluída em {formatDate(task.atualizado_em)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreClick(task.id, task.titulo)}
                        className="gap-1 text-green-600 dark:text-green-400 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Restaurar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePermanentDeleteClick(task.id, task.titulo)}
                        className="gap-1 text-red-600 dark:text-red-400 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={!!showRestoreConfirm.taskId} onOpenChange={(open) => !open && setShowRestoreConfirm({ taskId: null, taskTitle: '' })}>
        <AlertDialogContent className="dark:bg-purple-950 border-purple-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Restaurar tarefa
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
              Tem certeza que deseja restaurar a tarefa <strong>{showRestoreConfirm.taskTitle}</strong>? Ela voltará para a lista de tarefas ativas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRestore} className="bg-green-600 hover:bg-green-700">
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog open={!!showPermanentDeleteConfirm.taskId} onOpenChange={(open) => !open && setShowPermanentDeleteConfirm({ taskId: null, taskTitle: '' })}>
        <AlertDialogContent className="dark:bg-purple-950 border-purple-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Excluir permanentemente
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
              <strong>ATENÇÃO:</strong> Esta ação não pode ser desfeita. A tarefa <strong>{showPermanentDeleteConfirm.taskTitle}</strong> será removida permanentemente do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPermanentDelete} className="bg-red-600 hover:bg-red-700">
              Excluir permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};