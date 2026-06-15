/**
 * Task types for the To-Do List application - aligned with Supabase tarefas table
 */

export interface Task {
  id: string;
  usuario_id: string;
  titulo: string;
  descricao: string | null;
  data_vencimento: string | null;
  concluida: boolean;  // This column needs to be added to the table
  criado_em: string;
  atualizado_em: string;
}

export interface TaskInsert {
  titulo: string;
  descricao?: string | null;
  data_vencimento?: string | null;
  concluida?: boolean;
}

export interface TaskUpdate {
  titulo?: string;
  descricao?: string | null;
  data_vencimento?: string | null;
  concluida?: boolean;
}

export interface TaskFilters {
  concluida?: boolean;
  search?: string;
  sortBy?: 'criado_em' | 'data_vencimento';
}