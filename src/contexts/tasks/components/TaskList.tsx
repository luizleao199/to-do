"use client";

import { CheckSquare, Clock, Loader2, Calendar, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTasks } from "../hooks/useTasks";
import { TaskItem } from "./TaskItem";
import type { Task } from "../tasks.types";

export const TaskList = () => {
  const { data: tasks, isLoading, error, refetch } = useTasks();

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border-purple-100 dark:border-purple-800">
        <CardContent className="py-12 text-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Carregando tarefas...</p>
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
          <p className="text-red-600 dark:text-red-400 mb-2">Erro ao carregar tarefas</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{error.message}</p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <Loader2 className="w-4 h-4" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const pendingTasks = tasks?.filter(t => t.status !== 'concluida') ?? [];
  const completedTasks = tasks?.filter(t => t.status === 'concluida') ?? [];

  return (
    <div className="space-y-6">
      {/* Sort Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ordenar por:</span>
        </div>
        <Select
          onValueChange={(value) => {
            // This will trigger a refetch with new sort order via queryKey
            window.location.href = `?sort=${value}`;
          }}
          defaultValue="criado_em"
        >
          <SelectTrigger className="w-[180px] text-sm">
            <SelectValue placeholder="Data de criação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="criado_em">Data de criação (mais recente)</SelectItem>
            <SelectItem value="data_vencimento">Data de vencimento (mais próxima)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Pendentes ({pendingTasks.length})
            </h2>
          </div>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-green-500" />
              Concluídas ({completedTasks.length})
            </h2>
          </div>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {tasks?.length === 0 && (
        <Card className="bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border-purple-100 dark:border-purple-800">
          <CardContent className="py-12 px-6 text-center">
            <CheckSquare className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma tarefa ainda
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
              Crie sua primeira tarefa e comece a organizar seu dia com mais produtividade.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};