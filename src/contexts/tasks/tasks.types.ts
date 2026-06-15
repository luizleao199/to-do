/**
 * Task types for the To-Do List application - aligned with Supabase tarefas table
 * The database uses 'status' field with triggers that sync to pendentes/concluidas/excluidas tables
 */

export type TaskStatus = 'pendente' | 'concluida' | 'excluida';

export interface Task {
  id: string;
  usuario_id: string;
  titulo: string;
  descricao: string | null;
  data_vencimento: string | null;
  status: TaskStatus;
  criado_em: string;
  atualizado_em: string;
}

export interface TaskInsert {
  titulo: string;
  descricao?: string | null;
  data_vencimento?: string | null;
  status?: TaskStatus;
}

export interface TaskUpdate {
  titulo?: string;
  descricao?: string | null;
  data_vencimento?: string | null;
  status?: TaskStatus;
}

export interface TaskFilters {
  status?: TaskStatus;
  search?: string;
  sortBy?: 'criado_em' | 'data_vencimento';
}