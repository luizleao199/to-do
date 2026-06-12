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
├── components/
│   ├── TaskForm.tsx    # Formulário criar/editar tarefa
│   ├── TaskItem.tsx    # Item individual da tarefa
│   └── TaskList.tsx    # Lista com filtros e ordenação
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
| due_date | date | Data de vencimento opcional |
| completed | boolean | Status de conclusão (default: false) |
| created_at | timestamp | Data de criação (default: now()) |

## Row Level Security (RLS)

A tabela possui RLS habilitado com as seguintes políticas:

- **SELECT:** `auth.uid() = user_id` - Usuário vê apenas suas tarefas
- **INSERT:** `auth.uid() = user_id` - Usuário cria apenas suas tarefas
- **UPDATE:** `auth.uid() = user_id` - Usuário edita apenas suas tarefas
- **DELETE:** `auth.uid() = user_id` - Usuário deleta apenas suas tarefas

## Nova Coluna: due_date

- **Tipo:** `DATE` (opcional)
- **Validação no formulário:** Não pode ser uma data anterior a hoje
- **Formato de exibição:** dd/MM/yyyy (ex: 25/12/2024)

### Destaque Visual nas Tarefas

| Status | Condição | Visual |
|--------|----------|--------|
| **Atrasada** | `due_date < hoje` e `completed = false` | Borda vermelha + badge vermelho com ícone ⚠️ |
| **Vence hoje** | `due_date = hoje` e `completed = false` | Borda amarela + badge amarelo com ícone 📅 |
| **Normal** | `due_date > hoje` ou sem data | Borda padrão + badge cinza "Sem data" |
| **Concluída** | `completed = true` | Estilo normal (sem destaque de atraso) |

### Ordenação

Disponível via Select no topo da lista:
- **Data de criação** (padrão): mais recentes primeiro
- **Data de vencimento**: mais próximas primeiro (datas nulas por último)

## Hooks Disponíveis

### `useTasks(filters?)`
Busca tarefas do usuário logado.
- `filters.completed` - filtrar por status
- `filters.search` - busca por título
- `filters.sortBy` - `'created_at'` | `'due_date'`

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
const { data: tasks, isLoading } = useTasks({ sortBy: 'due_date' });
const createTask = useCreateTask();
const toggleTask = useToggleTask();
const deleteTask = useDeleteTask();

// Criar com data de vencimento
createTask.mutate({ 
  title: 'Nova tarefa', 
  description: 'Detalhes',
  due_date: '2024-12-31' // formato ISO YYYY-MM-DD
});

// Toggle
toggleTask.mutate({ id: task.id, completed: !task.completed });

// Deletar
deleteTask.mutate(task.id);
```

## Autenticação

Todas as operações requerem usuário autenticado. O `user_id` é preenchido automaticamente pelo serviço usando `supabase.auth.getUser()`.