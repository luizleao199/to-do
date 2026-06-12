# Tasks Context

Contexto responsável pelo gerenciamento de tarefas (To-Do List) do usuário.

## Estrutura

```
src/contexts/tasks/
├── tasks.types.ts      # Tipos TypeScript
├── services/
│   └── taskService.ts  # Operações CRUD com Supabase
├── hooks/
│   └── useTasks.ts     # Hooks TanStack Query
└── README.md           # Esta documentação
```

## Tabela do Banco de Dados

**Tabela:** `public.tasks`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Primary key, gerado automaticamente |
| user_id | uuid | Referência a `auth.users` (FK) |
| title | text | Título da tarefa (obrigatório) |
| description | text | Descrição opcional |
| completed | boolean | Status de conclusão (default: false) |
| created_at | timestamp | Data de criação (default: now()) |

## Row Level Security (RLS)

A tabela possui RLS habilitado com as seguintes políticas:

- **SELECT:** `auth.uid() = user_id` - Usuário vê apenas suas tarefas
- **INSERT:** `auth.uid() = user_id` - Usuário cria apenas suas tarefas
- **UPDATE:** `auth.uid() = user_id` - Usuário edita apenas suas tarefas
- **DELETE:** `auth.uid() = user_id` - Usuário deleta apenas suas tarefas

## Hooks Disponíveis

### `useTasks(filters?)`
Busca tarefas do usuário logado.
- `filters.completed` - filtrar por status
- `filters.search` - busca por título

### `useCreateTask()`
Cria nova tarefa. Invalida cache automaticamente.

### `useUpdateTask()`
Atualiza tarefa existente.

### `useDeleteTask()`
Remove tarefa.

### `useToggleTask()`
Alterna status de conclusão (completed).

## Uso no Dashboard

```tsx
const { data: tasks, isLoading } = useTasks();
const createTask = useCreateTask();
const toggleTask = useToggleTask();
const deleteTask = useDeleteTask();

// Criar
createTask.mutate({ title: 'Nova tarefa', description: 'Detalhes' });

// Toggle
toggleTask.mutate({ id: task.id, completed: !task.completed });

// Deletar
deleteTask.mutate(task.id);
```

## Autenticação

Todas as operações requerem usuário autenticado. O `user_id` é preenchido automaticamente pelo serviço usando `supabase.auth.getUser()`.